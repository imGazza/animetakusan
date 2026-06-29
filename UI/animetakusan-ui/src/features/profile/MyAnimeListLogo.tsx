// MyAnimeList wordmark monogram. Rendered as text so it stays crisp at any tile size.
const MyAnimeListLogo = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="MyAnimeList"
  >
    <text
      x="50%"
      y="54%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize="9"
      fontWeight="800"
      letterSpacing="-0.3"
      fill="currentColor"
      fontFamily="inherit"
    >
      MAL
    </text>
  </svg>
);

export default MyAnimeListLogo;
