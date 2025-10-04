using Amazon.S3;
using Amazon.S3.Model;
using BrigadeWebService_BLL.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace BrigadeWebService_BLL.Services.Realizations.AWS
{
    public class S3ImageService
    {
        private readonly IAmazonS3 _s3;
        private readonly string _bucket;
        private readonly string _basePrefix;
        private static readonly HashSet<string> Allowed = new([ "image/jpeg", "image/png", "image/webp", "image/heic" ]);
        private const long MaxSize = 100L * 1024 * 1024;

        public S3ImageService(IAmazonS3 s3, IConfiguration cfg)
        {
            _s3 = s3;
            _bucket = cfg["S3:Bucket"]!;
            _basePrefix = (cfg["S3:BasePrefix"] ?? "uploads").Trim('/');
        }

        /// <summary>
        /// Upload image to S3 for given object type and id
        /// </summary>
        /// <param name="objectId">Donation or Report Id</param>
        /// <param name="file">Image</param>
        /// <param name="contentType"></param>
        /// <param name="ct"></param>
        /// <returns>key and eTag</returns>
        public async Task<(string, string?)> UploadImagesAsync(int objectId, IFormFile file, Content contentType, CancellationToken ct)
        {
            Validate(file);
            var key = $"{_basePrefix}/{contentType.ToString().ToLower()}/{objectId}/images/{Guid.NewGuid():N}{ExtFor(file.ContentType, file.FileName)}";
            using var s = file.OpenReadStream();
            var resp = await _s3.PutObjectAsync(new PutObjectRequest
            {
                BucketName = _bucket,
                Key = key,
                InputStream = s,
                ContentType = file.ContentType,
                ServerSideEncryptionMethod = ServerSideEncryptionMethod.AES256
            }, ct);
            return (key, resp.ETag);
        }

        public async Task DeleteImageAsync(string key, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(key))
                throw new ArgumentException("S3 key cannot be null or empty.", nameof(key));

            await _s3.DeleteObjectAsync(new DeleteObjectRequest
            {
                BucketName = _bucket,
                Key = key
            }, ct);
        }

        public string CreatePreassignedGet(string key, int minutes = 15)
        {
            return _s3.GetPreSignedURL(new GetPreSignedUrlRequest
            {
                BucketName = _bucket,
                Key = key,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(minutes)
            });
        }

        private static void Validate(IFormFile f)
        {
            if (!Allowed.Contains(f.ContentType)) throw new InvalidOperationException("Unsupported content type");
            if (f.Length <= 0 || f.Length > MaxSize) throw new InvalidOperationException("Invalid file size");
        }

        private static string ExtFor(string contentType, string original)
        {
            var ext = Path.GetExtension(original).ToLowerInvariant();
            if (!string.IsNullOrWhiteSpace(ext)) return ext;
            return contentType switch
            {
                "image/jpeg" => ".jpg",
                "image/png" => ".png",
                "image/webp" => ".webp",
                "image/heic" => ".heic",
                _ => ".bin"
            };
        }
    }
}
