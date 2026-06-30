namespace AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

public class ViewerInfoResponse
{
    public int Id { get; set; }
    public string Avatar { get; set; }
    public string Name { get; set; }
    public int UnreadNotificationCount { get; set; }
}
