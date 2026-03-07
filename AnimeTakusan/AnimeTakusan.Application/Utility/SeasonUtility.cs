namespace AnimeTakusan.Application.Utility;

public static class SeasonUtility
{
    public static string GetCurrentSeason(DateTime date)
    {
        int month = date.Month;
        
        return month switch
        {
            1 or 2 or 3 => "WINTER",
            4 or 5 or 6 => "SPRING",
            7 or 8 or 9 => "SUMMER",
            10 or 11 or 12 => "FALL",
            _ => throw new ArgumentException("Invalid month")
        };
    }

    public static int GetCurrentSeasonYear(DateTime date)
    {
        return date.Month == 12 ? date.Year + 1 : date.Year;
    }

    public static string GetNextSeason(string currentSeason)
    {
        return currentSeason switch
        {
            "WINTER" => "SPRING",
            "SPRING" => "SUMMER",
            "SUMMER" => "FALL",
            "FALL" => "WINTER",
            _ => throw new ArgumentException("Invalid season")
        };
    }

    public static string GetLastSeason(string currentSeason)
    {
        return currentSeason switch
        {
            "WINTER" => "FALL",
            "SPRING" => "WINTER",
            "SUMMER" => "SPRING",
            "FALL" => "SUMMER",
            _ => throw new ArgumentException("Invalid season")
        };
    }

    public static int GetNextSeasonYear(string currentSeason, int currentYear)
    {
        return currentSeason == "FALL" ? currentYear + 1 : currentYear;
    }

    public static int GetLastSeasonYear(string currentSeason, int currentYear)
    {
        return currentSeason == "WINTER" ? currentYear - 1 : currentYear;
    }
}

