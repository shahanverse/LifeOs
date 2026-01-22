export default function SpotifyPlayer({ title, playlistId }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h3 className="font-semibold mb-3">🎧 {title}</h3>

      <iframe
        src={`https://open.spotify.com/embed/playlist/${playlistId}`}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="rounded-xl"
      />
    </div>
  );
}
