using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Application.Utility;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AnimeTakusan.API.Controllers
{
    [ApiController]
    [EnableCors("Public")]
    [EnableRateLimiting("anime")]
    [Route("[controller]")]
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

        [HttpGet("seasonal")]
        public async Task<IActionResult> GetSeasonalAnime()
        {
            return Ok(await _animeService.GetSeasonalAnime());
        }

        [HttpGet("browse")]
        public async Task<IActionResult> GetAnimeBrowseSection()
        {
            return Ok(await _animeService.GetAnimeBrowseSection());
        }

        [HttpPost]
        public async Task<IActionResult> GetAnime([FromBody] AnimeFilterRequest animeFilterRequest)
        {
            return Ok(await _animeService.GetAnime(animeFilterRequest));
        }

        [HttpGet("library")]
        public async Task<IActionResult> GetUserAnimeList()
        {
            // AniListUserId is exctracted from the JWT token
            return User.FindFirst(AniListClaimTypes.AniListUserId)?.Value is not string userId
                ? throw new Exception("Please link your AniList account to access your anime library.")
                : Ok(await _animeService.GetUserAnimeLibrary(int.Parse(userId)));
        }

        [HttpPost("upsert")]
        public async Task<IActionResult> UpsertAnimeEntry([FromBody] AnimeEntryUpsertRequest animeEntryUpsertRequest)
        {
            return Ok(await _animeService.UpsertAnimeEntry(animeEntryUpsertRequest));
        }

        [HttpPost("{animeId}/toggle-favourite")]
        public async Task<IActionResult> ToggleFavourite(int animeId)
        {
            return Ok(await _animeService.ToggleFavourite(animeId));
        }

        [HttpPost("{animeEntryId}/delete-entry")]
        public async Task<IActionResult> DeleteAnimeEntry(int animeEntryId)
        {
            return Ok(await _animeService.DeleteAnimeEntry(animeEntryId));
        }

    }

}
