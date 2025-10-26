import { useState, useEffect, useCallback } from "react";
import { API_CONFIG } from "../config/api";

export default function DonationImageManager({
  donationId,
}: {
  donationId: number;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const fetchView = useCallback(async () => {
    const r = await fetch(
      `${API_CONFIG.BASE_URL}/api/images/donations/${donationId}/view`
    );
    if (r.ok) {
      const data = await r.json();
      setUrl(data.url);
    } else {
      setUrl(null);
    }
  }, [donationId]);

  useEffect(() => {
    fetchView();
  }, [donationId, fetchView]);

  async function handleFile(file: File) {
    const fd = new FormData();
    fd.append("Photo", file, file.name);

    const r = await fetch(
      `${API_CONFIG.BASE_URL}/api/images/donations/${donationId}`,
      {
        method: "POST",
        body: fd,
      }
    );

    setMsg(r.ok ? "Фото оновлено" : `Помилка: ${await r.text()}`);

    if (r.ok) {
      await fetchView(); // Refresh the image
    }
  }

  return (
    <div>
      {url ? (
        <img src={url} alt="donation" style={{ maxWidth: 200 }} />
      ) : (
        <div>Нема фото</div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
      />
      {msg && <p>{msg}</p>}
    </div>
  );
}
