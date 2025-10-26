import { useEffect, useState, useCallback } from "react";
import { API_CONFIG } from "../config/api";

type PresignRes = { uploadUrl: string; key: string };

type ImageRow = {
  id: number;
  objectKey: string;
  width?: number;
  height?: number;
  createdAt: string;
};

export default function ReportImagesManager({
  reportId,
}: {
  reportId: number;
}) {
  const [images, setImages] = useState<ImageRow[]>([]);
  const [msg, setMsg] = useState("");
  const [progress, setProgress] = useState<number>(0);

  const fetchList = useCallback(async () => {
    const r = await fetch(
      `${API_CONFIG.BASE_URL}/api/images/reports/${reportId}`
    );
    if (r.ok) {
      const data = await r.json();
      setImages(data);
    }
  }, [reportId]);

  useEffect(() => {
    fetchList();
  }, [reportId, fetchList]);

  function getImageDims(
    file: File
  ): Promise<{ width: number; height: number }> {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload = () => res({ width: img.width, height: img.height });
      img.onerror = rej;
      img.src = URL.createObjectURL(file);
    });
  }

  async function uploadFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/heic"];

    for (const file of Array.from(files)) {
      if (!allowed.includes(file.type)) {
        setMsg("Непідтримуваний тип");
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setMsg("Файл > 25MB");
        return;
      }

      setMsg("Готуємо завантаження...");
      const pres = await fetch(
        `${API_CONFIG.BASE_URL}/api/images/reports/${reportId}/presign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            contentType: file.type,
            size: file.size,
          }),
        }
      );
      if (!pres.ok) {
        setMsg("Помилка presign");
        return;
      }
      const p = (await pres.json()) as PresignRes;

      const etag = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", p.uploadUrl, true);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable)
            setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300)
            resolve(xhr.getResponseHeader("ETag") || "");
          else reject(new Error(`Upload failed: ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(file);
      });

      const dims = await getImageDims(file);
      const confirm = await fetch(
        `${API_CONFIG.BASE_URL}/api/images/reports/${reportId}/confirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: p.key,
            etag,
            width: dims.width,
            height: dims.height,
          }),
        }
      );
      if (!confirm.ok) {
        setMsg("Помилка підтвердження");
        return;
      }

      setMsg("Готово");
      setProgress(0);
      await fetchList();
    }
  }

  async function openView(imageId: number) {
    const r = await fetch(
      `${API_CONFIG.BASE_URL}/api/images/reports/${reportId}/${imageId}/view`
    );
    if (!r.ok) {
      setMsg("Не вдалось отримати лінк");
      return;
    }
    const { url } = await r.json();
    window.open(url, "_blank");
  }

  async function remove(imageId: number) {
    const r = await fetch(
      `${API_CONFIG.BASE_URL}/api/images/reports/${reportId}/${imageId}`,
      {
        method: "DELETE",
      }
    );
    if (!r.ok) {
      setMsg("Не вдалось видалити");
      return;
    }
    await fetchList();
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => uploadFiles(e.target.files)}
      />
      {progress > 0 && progress < 100 && <div>Завантаження: {progress}%</div>}
      {msg && <div style={{ marginTop: 8 }}>{msg}</div>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 160px)",
          gap: 12,
          marginTop: 12,
        }}
      >
        {images.map((img) => (
          <div
            key={img.id}
            style={{ border: "1px solid #eee", padding: 8, borderRadius: 8 }}
          >
            <div style={{ fontSize: 12, color: "#666" }}>ID: {img.id}</div>
            <div
              style={{ fontSize: 12, color: "#666", wordBreak: "break-all" }}
            >
              {img.objectKey}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={() => openView(img.id)}>Відкрити</button>
              <button onClick={() => remove(img.id)}>Видалити</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
