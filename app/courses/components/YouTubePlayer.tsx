"use client";

interface YouTubePlayerProps {
  videoUrl: string;
  title?: string;
}

// Fungsi untuk mengekstrak Video ID dari berbagai format URL YouTube
const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export const YouTubePlayer = ({ videoUrl, title = "Video Pembelajaran" }: YouTubePlayerProps) => {
    const videoId = getYouTubeVideoId(videoUrl);

    if (!videoId) {
        return <div className="w-full aspect-video bg-neutral-800 flex items-center justify-center text-neutral-400">URL Video YouTube tidak valid.</div>;
    }

    return (
        <div className="aspect-video w-full overflow-hidden rounded-lg shadow-2xl">
            <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            ></iframe>
        </div>
    );
};