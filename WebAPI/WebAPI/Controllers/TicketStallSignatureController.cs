using System;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("TicketStall/[action]")]
    public class TicketStallSignatureController : ControllerBase
    {
        private IWebHostEnvironment Environment { get; }

        public TicketStallSignatureController(IWebHostEnvironment webHostEnvironment)
        {
            Environment = webHostEnvironment;
        }

        [HttpPost]
        public async Task<IActionResult> SaveSignature(Signature signature)
        {
            try
            {
                var imageBytes = Convert.FromBase64String(signature.SignatureImageData);
                var imagePath = Path.Combine(Environment.WebRootPath, "signatures", $"signature_{Guid.NewGuid()}.png");
                await using (var imageFile = new FileStream(imagePath, FileMode.Create))
                {
                    await imageFile.WriteAsync(imageBytes, 0, imageBytes.Length);
                    imageFile.Flush();
                }

                return Ok();
            }
            catch (Exception e)
            {
                return new JsonResult(new {StatusCode = 500, Message = e.Message});
            }
        }
    }
}