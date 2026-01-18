using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Application.Interfaces;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AnimeTakusan.API.Controllers
{    
    [ApiController]
    [EnableCors("Public")]
    [EnableRateLimiting("anime")]
    [Route("api/[controller]")]
    public class AnimeController : ControllerBase
    {
        private readonly IAnimeService _animeService;

        public AnimeController(IAnimeService animeService)
        {
            _animeService = animeService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAnimeById(int id)
        {
            return Ok(await _animeService.GetAnimeById(id));
        }

        [HttpPost("seasonal")]
        public async Task<IActionResult> GetSeasonalAnime([FromBody] AnimeSeasonalRequest animeSeasonalRequest)
        {
            return Ok(await _animeService.GetSeasonalAnime(animeSeasonalRequest));
        }

        [HttpPost("browse")]
        public async Task<IActionResult> GetAnimeBrowseSection([FromBody] AnimeBroseSectionRequest animeBroseSectionRequest)
        {
            return Ok(await _animeService.GetAnimeBrowseSection(animeBroseSectionRequest));
        }
    }
    
}
