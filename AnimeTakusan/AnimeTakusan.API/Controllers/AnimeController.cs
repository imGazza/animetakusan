using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;
using AnimeTakusan.Application.DTOs.Messages;
using AnimeTakusan.Application.Interfaces;
using AnimeTakusan.Application.Utility;
using Microsoft.AspNetCore.Authorization;
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
        private readonly IMalSyncService _malSyncService;
        private readonly ILogger<AnimeController> _logger;

        public AnimeController(IAnimeService animeService, IMalSyncService malSyncService, ILogger<AnimeController> logger)
        {
            _animeService = animeService;
            _malSyncService = malSyncService;
            _logger = logger;
        }

        [Authorize(Roles = "Guest,User")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAnimeById(int id)
        {
            return Ok(await _animeService.GetAnimeById(id));
        }

        [Authorize(Roles = "Guest,User")]
        [HttpGet("browse")]
        public async Task<IActionResult> GetAnimeBrowseSection()
        {
            return Ok(await _animeService.GetAnimeBrowseSection());
        }

        [Authorize(Roles = "Guest,User")]
        [HttpPost]
        public async Task<IActionResult> GetAnime([FromBody] AnimeFilterRequest animeFilterRequest)
        {
            return Ok(await _animeService.GetAnime(animeFilterRequest));
        }

        [Authorize(Roles = "User")]
        [HttpGet("library")]
        public async Task<IActionResult> GetUserAnimeList()
        {
            // AniListUserId is exctracted from the JWT token
            return User.FindFirst(AniListClaimTypes.AniListUserId)?.Value is not string userId
                ? BadRequest("Please link your AniList account to access your anime library.")
                : Ok(await _animeService.GetUserAnimeLibrary(int.Parse(userId)));
        }

        [Authorize(Roles = "User")]
        [EnableCors("Authenticated")]
        [HttpPost("upsert")]
        public async Task<IActionResult> UpsertAnimeEntry([FromBody] AnimeEntryUpsertRequest animeEntryUpsertRequest)
        {
            if (User.Claims.FirstOrDefault(c => c.Type == MyAnimeListClaimTypes.MalUserId)?.Value is not string malUserId)
            {
                return BadRequest("Please link your MyAnimeList account to upsert anime entries.");
            }

            var result = await _animeService.UpsertAnimeEntry(animeEntryUpsertRequest);

            try{
                await _malSyncService.PublishMalSyncAction(int.Parse(malUserId), animeEntryUpsertRequest, SyncAction.Upsert);
                _logger.LogInformation("Published MAL sync action for user {MalUserId} and anime {MediaId}", malUserId, animeEntryUpsertRequest.MediaId);
            }
            catch(Exception ex){
                _logger.LogError(ex, "Failed to publish MAL sync action for user {MalUserId} and anime {MediaId}", malUserId, animeEntryUpsertRequest.MediaId);
            }

            return Ok(result);
        }

        [Authorize(Roles = "User")]
        [EnableCors("Authenticated")]
        [HttpPost("{animeId}/toggle-favourite")]
        public async Task<IActionResult> ToggleFavourite(int animeId)
        {
            return Ok(await _animeService.ToggleFavourite(animeId));
        }

        [Authorize(Roles = "User")]
        [EnableCors("Authenticated")]
        [HttpPost("delete-entry")]
        public async Task<IActionResult> DeleteAnimeEntry([FromBody] AnimeDeleteEntry animeDeleteEntry)
        {
            if (User.Claims.FirstOrDefault(c => c.Type == MyAnimeListClaimTypes.MalUserId)?.Value is not string malUserId)
            {
                return BadRequest("Please link your MyAnimeList account to upsert anime entries.");
            }
            
            var result = await _animeService.DeleteAnimeEntry(animeDeleteEntry.MediaListEntryId);

            try{
                await _malSyncService.PublishMalSyncAction(int.Parse(malUserId), new AnimeEntryUpsertRequest { MalId = animeDeleteEntry.MalId }, SyncAction.Delete);
                _logger.LogInformation("Published MAL sync action for user {MalUserId} and anime {MediaId}", malUserId, animeDeleteEntry.MalId);
            }
            catch(Exception ex){
                _logger.LogError(ex, "Failed to publish MAL sync action for user {MalUserId} and anime {MediaId}", malUserId, animeDeleteEntry.MalId);
            }

            return Ok(result);
        }

    }

}
