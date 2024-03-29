const VideoPage = () => {

    return (
        <div className='videopage-container'>
        <iframe
            width='100%'
            height='100%'
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowfullscreen
        />
        </div>
    )
}

export default VideoPage;