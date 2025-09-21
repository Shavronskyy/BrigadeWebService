using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BrigadeWebService_BLL.Options
{

    public class UploadOptions
    {
        public string BaseFolder { get; set; } = "uploads/reports";
        public long MaxSizeBytes { get; set; } = 10 * 1024 * 1024;  // 10 MB
        public string[] AllowedExtensions { get; set; } = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
    }
}
