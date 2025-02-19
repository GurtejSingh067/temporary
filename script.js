console.log("Now the Tabahi Begins...")
let songs
let title
let currentSong = new Audio()
let currentSrc = ""
let audioOngoing = false
let currentLi
let previousLi
let playingTrack = ""

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    // Ensure two-digit format
    let formattedMinutes = String(minutes).padStart(2, "0");
    let formattedSeconds = String(remainingSeconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function populateCards(sectionTitle, previousHTML = false, firstTime = false) {
    let fetchCardTitle = await fetch(`/Songs/${sectionTitle}/`)
    let cardTitle = await fetchCardTitle.text()
    let div = document.createElement("div")
    div.innerHTML = cardTitle
    let cardsTitles = []
    div.querySelectorAll("a").forEach(e => {
        if (e.href.includes("/Songs/")) {
            if (e.title) {
                cardsTitles.push(e.title)
            }
        }
    })

    let rightBox = document.querySelector(".rightBox")
    if (firstTime) {
        if (sectionTitle === "!Popular Artists") {
            sectionTitle = sectionTitle.replace("!", "")
            rightBox.innerHTML = `<div data-folder="!${sectionTitle}" class="section">
                    <div class="head invert font">
                    <div class="heading">${sectionTitle}</div>
                    <div class="showAll-Button">Show All</div>
                </div>
                <div class="artistsCards"></div>
            </div>`

            let artistsCards = document.querySelector(".artistsCards")
            for (const title of cardsTitles) {
                let fetchjson = await fetch(`/Songs/!${sectionTitle}/${title}/info.json`)
                let jsonFile = await fetchjson.json()
                artistsCards.innerHTML = artistsCards.innerHTML + `<div data-folder="${title}" class="card">
                        <img class="img-Section1" src="/Songs/!${sectionTitle}/${title}/cover.jpg"
                            alt="${title}">
                        <img class="playButton" src="Svgs/playButton.svg" alt="playButton">
                        <div class="name invert font">${title}</div>
                        <div class="artist invert font">${jsonFile.description}</div>
                    </div>`
            }
            firstTime = false
        }

        else {
            rightBox.innerHTML = `<div data-folder="${sectionTitle}" class="section">
                <div class="head invert font">
                <div class="heading">${sectionTitle}</div>
                <div class="showAll-Button">Show All</div>
                </div>
                <div class="artistsCards"></div>
            </div>`


            let artistsCards = document.querySelector(".artistsCards")
            for (const title of cardsTitles) {
                let fetchjson = await fetch(`/Songs/${sectionTitle}/${title}/info.json`)
                let jsonFile = await fetchjson.json()
                artistsCards.innerHTML = artistsCards.innerHTML + `<div data-folder="${title}" class="card-Section2">
                        <img class="img-Section2" src="/Songs/${sectionTitle}/${title}/cover.jpg"
                            alt="${title}">
                        <img class="playButton" src="Svgs/playButton.svg" alt="playButton">
                        <div class="name invert font">${title}</div>
                        <div class="artist invert font">${jsonFile.description}</div>
                    </div>`
            }
            firstTime = false
        }
    }


    else if (sectionTitle === "!Popular Artists") {
        sectionTitle = sectionTitle.replace("!", "")
        rightBox.innerHTML = rightBox.innerHTML + `<div data-folder="${sectionTitle}" class="section">
        <div class="head invert font">
            <div class="heading">${sectionTitle}</div>
            <div class="showAll-Button">Show All</div>
        </div>
        <div class="artistsCards"></div>
        </div>`

        let artistsCards = document.querySelectorAll(".artistsCards")[document.querySelectorAll(".artistsCards").length - 1]
        for (const title of cardsTitles) {
            let fetchjson = await fetch(`/Songs/!${sectionTitle}/${title}/info.json`)
            let jsonFile = await fetchjson.json()
            artistsCards.innerHTML = artistsCards.innerHTML + `<div data-folder="${title}" class="card">
                    <img class="img-Section1" src="/Songs/!${sectionTitle}/${title}/cover.jpg"
                        alt="${title}">
                    <img class="playButton" src="Svgs/playButton.svg" alt="playButton">
                    <div class="name invert font">${title}</div>
                    <div class="artist invert font">${jsonFile.description}</div>
                </div>`
        }
    }

    else {
        rightBox.innerHTML = firstTime ? `<div data-folder="${sectionTitle}" class="section">
        <div class="head invert font">
        <div class="heading">${sectionTitle}</div>
        <div class="showAll-Button">Show All</div>
        </div>
        <div class="artistsCards"></div>
        </div>` + rightBox.innerHTML : rightBox.innerHTML + `<div data-folder="${sectionTitle}" class="section">
        <div class="head invert font">
        <div class="heading">${sectionTitle}</div>
        <div class="showAll-Button">Show All</div>
        </div>
        <div class="artistsCards"></div>
        </div>`
        firstTime = false



        let artistsCards = document.querySelectorAll(".artistsCards")[document.querySelectorAll(".artistsCards").length - 1]
        for (const title of cardsTitles) {
            let fetchjson = await fetch(`/Songs/${sectionTitle}/${title}/info.json`)
            let jsonFile = await fetchjson.json()
            artistsCards.innerHTML = artistsCards.innerHTML + `<div data-folder="${title}" class="card-Section2">
                    <img class="img-Section2" src="/Songs/${sectionTitle}/${title}/cover.jpg"
                        alt="${title}">
                    <img class="playButton" src="Svgs/playButton.svg" alt="playButton">
                    <div class="name invert font">${title}</div>
                    <div class="artist invert font">${jsonFile.description}</div>
                </div>`
        }
    }
    rightBox.innerHTML = rightBox.innerHTML + previousHTML
}


async function fetchAlbums() {
    let previousHTML = document.querySelector(".rightBox").innerHTML
    let fetchSectionTitle = await fetch("/Songs")
    let sectionTitle = await fetchSectionTitle.text()
    console.log(sectionTitle)
    let div = document.createElement("div")
    div.innerHTML = sectionTitle
    let arrSectionTitle = []
    div.querySelectorAll("a").forEach(e => {
        if (e.href.includes("/Songs/")) {
            let filteredTitle = e.href.split("/Songs/")[1].replaceAll("%20", " ")
            arrSectionTitle.push(filteredTitle)
        }
    })
    console.log(arrSectionTitle)
    for (let i = 0; i < arrSectionTitle.length; i++) {
        if (i === 0) {
            await populateCards(arrSectionTitle[i], "", true)
        }
        else if (i === (arrSectionTitle.length - 1)) {
            await populateCards(arrSectionTitle[i], previousHTML)
        }
        else {
            await populateCards(arrSectionTitle[i]);
        }
    }
}

// Funciton to Fetch Songs Links(Href(s))
async function getSongs(folder) {
    let fetchItems = await fetch(`/Songs/${folder}/`)
    let fetchedSongs = await fetchItems.text()
    let songsHTML = document.createElement("div")
    songsHTML.innerHTML = fetchedSongs
    let lists = songsHTML.getElementsByTagName("li")
    let songs = []
    index = 0
    for (let i = 0; i < lists.length; i++) {
        const anchors = lists[i].getElementsByTagName("a")
        if (anchors[0].href.endsWith(".mp3")) {
            songs[index] = anchors[0].href
            index++
            // songs.push(anchors[0].href)      //We can also use
        }
    }
    return songs
}


// Function to get Titles of the Songs
async function getTitles(folder) {
    let fetchItems = await fetch(`/Songs/${folder}/`)
    let fetchedSongs = await fetchItems.text()
    let songsHTML = document.createElement("div")
    songsHTML.innerHTML = fetchedSongs
    let lists = songsHTML.getElementsByTagName("li")
    let title = []
    let index = 0
    for (let i = 0; i < lists.length; i++) {
        const anchors = lists[i].getElementsByTagName("a")
        if (anchors[0].href.endsWith(".mp3")) {
            title[index] = anchors[0].innerText
            index++
        }
    }
    return title
}


// Function to Design Playlist
function createPlaylist(numberOfSongs, title) {
    document.querySelector("ul").innerHTML = ''
    document.querySelectorAll(".creatingPlaylist-Section").forEach(e => {
        e.style.display = "none"
    })
    let ul = document.body.querySelector("ul")
    ul.style.cssText = "overflow: auto; height: 50vh; margin-top: 10px; display: flex; flex-direction: column; align-items: center;"
    for (let i = 0; i < numberOfSongs; i++) {
        let li = document.createElement("li")
        let div = document.createElement("div")
        div.style.cssText = "color: white; padding: 10px; width: 218px; word-wrap: break-word; "
        div.innerHTML = `${title[i].replace(/(\.mp3).*/, "$1")}`       //used to remove text after ".mp3" word
        let img = document.createElement("img")
        if (title[i].replace(/(\.mp3).*/, "$1") === playingTrack) {
            if (playingTrack === currentSrc && audioOngoing === true) {
                img.src = "Svgs/pause.svg"
                li.append(div, img)
                currentLi = li.lastElementChild
                previousLi = li.lastElementChild
                ul.append(li)
            }
            else {
                img.src = "Svgs/play.svg"
                li.append(div, img)
                currentLi = li.lastElementChild
                ul.append(li)
            }
        }
        else {
            img.src = "Svgs/play.svg";
            li.append(div, img)
            ul.append(li)
        }

    }
}

function addLiEventListeners(parentFolder, childFolder) {
    document.querySelectorAll("li").forEach(e => {
        e.addEventListener("click", () => {
            document.querySelector(".songTitle").innerHTML = e.firstElementChild.innerHTML
            document.querySelector(".songController").style.bottom = "0"
            document.querySelector(".showSongControllerArrow").style.display = "none"
            currentLi = e.lastElementChild
            playAudio(e.firstElementChild.innerHTML, parentFolder, childFolder);
            currentSong.volume = 1
            document.querySelector(".volumeRange").value = 100
        });
    });
}

function playAudio(track, parentFolder, childFolder) {
    //new Audio() makes an audio element and take 'source/link' set its 'src' attribute equal to  given path and its automatically replaces spaces with %20
    if (currentSrc === track) {
        if (audioOngoing === false) {
            audioOngoing = true
            currentSong.src = `/songs/${parentFolder}/${childFolder}/${track}`
            currentSrc = track
            currentSong.play()
            currentLi.src = "Svgs/pause.svg"
            document.querySelector(".songsControllerPlaySvg").src = "Svgs/pause.svg"

        }
        else {
            audioOngoing = false
            currentSong.pause()
            currentLi.src = "Svgs/play.svg"
            document.querySelector(".songsControllerPlaySvg").src = "Svgs/play.svg"
        }
    }
    else {
        audioOngoing = true
        currentSong.src = `/Songs/${parentFolder}/${childFolder}/${track}`
        currentSrc = track
        currentSong.play()
        playingTrack = track
        if (previousLi && previousLi !== currentLi) {
            currentLi.src = "Svgs/pause.svg"
            previousLi.src = "Svgs/play.svg"
            previousLi = currentLi
            document.querySelector(".songsControllerPlaySvg").src = "Svgs/pause.svg"

        }
        else if (previousLi !== currentLi) {
            currentLi.src = "Svgs/pause.svg"
            previousLi = currentLi
            document.querySelector(".songsControllerPlaySvg").src = "Svgs/pause.svg"
        }
    }
}

function hamburgerController() {
    document.querySelector(".leftBox").style.left = "-300px"
    document.querySelector(".overlayDiv").style.display = "none"
    document.removeEventListener("click", hamburgerController)
}

// Main Function which control each activity and function
async function main() {
    let parentFolder
    let childFolder

    await fetchAlbums()

    //Adding an EventListener to Play Button of Cards
    document.querySelectorAll(".playButton").forEach(e => {
        e.addEventListener("click", async (event) => {
            event.stopPropagation();
            document.querySelector("ul").innerHTML = ""
            parentFolder = e.parentElement.parentElement.parentElement.dataset.folder
            childFolder = e.parentElement.dataset.folder
            songs = await getSongs(`${parentFolder}/${childFolder}`)
            let title = await getTitles(`${parentFolder}/${childFolder}`)
            playingTrack = title[0].replace(/(\.mp3).*/, "$1")
            createPlaylist(songs.length, title)

            currentLi = document.querySelector("li").lastElementChild
            playAudio(document.querySelector("li").firstElementChild.innerHTML, parentFolder, childFolder)
            document.querySelector(".songController").style.bottom = "20px"
            document.querySelector(".showSongControllerArrow").style.display = "none"

            document.querySelector(".songTitle").innerHTML = `${document.querySelector("li").firstElementChild.innerHTML}`

            addLiEventListeners(parentFolder, childFolder)
            currentSong.volume = 1
            document.querySelector(".volumeRange").value = 100
        })
    })

    // Add Event Listeners for Cards
    document.querySelectorAll(".card, .card-Section2").forEach(e => {
        e.addEventListener("click", async () => {
            document.querySelector("ul").innerHTML = ""
            const media = window.matchMedia("(max-width: 900px) and (max-height: 950px)")
            if (media.matches) {
                document.querySelector(".cardLoader-Mobiles").style.display = "block"
            }
            else {
                document.querySelector(".cardLoader").style.display = "block"
            }
            parentFolder = e.parentElement.parentElement.dataset.folder
            childFolder = e.dataset.folder
            document.querySelector("ul").style.display = "flex"
            document.querySelectorAll(".creatingPlaylist-Section").forEach(e => {
                e.style.display = "none"
            })
            songs = await getSongs(`${parentFolder}/${childFolder}`)
            let title = await getTitles(`${parentFolder}/${childFolder}`)
            playingTrack = title[0].replace(/(\.mp3).*/, "$1")
            createPlaylist(songs.length, title)
            document.querySelector(".cardLoader").style.display = "none"
            document.querySelector(".cardLoader-Mobiles").style.display = "none"

            //addLiEventListeners funciton is used to set evenlisteners to li(s)
            addLiEventListeners(parentFolder, childFolder)
            document.querySelectorAll(".creatingPlaylist-Section").forEach(e => {
                e.style.display = "none"
            })
            document.querySelector(".leftBox").style.left = "0px"
        })
    })

    // Adding AddEventListener to seekbaar's PlayButton
    document.querySelector(".songsControllerPlaySvg").addEventListener("click", (e) => {
        if (audioOngoing === true) {
            audioOngoing = false
            currentSong.pause()
            e.target.src = "Svgs/play.svg"
            currentLi.src = "Svgs/play.svg"
        }
        else {
            audioOngoing = true
            currentSong.play()
            e.target.src = "Svgs/pause.svg"
            currentLi.src = "Svgs/pause.svg"
        }
    })

    // Adding AddEventListener to in Seekbar's Previous Button
    document.querySelector(".controllerSvgs").firstElementChild.addEventListener("click", (e) => {
        let index = songs.indexOf(currentSong.src)
        if (!songs[index - 1]) {
            audioOngoing = true
            currentLi = document.querySelector("ul").querySelector("li").lastElementChild
            currentLi.src = "Svgs/pause.svg"
            let str = songs[0].slice(songs[0].lastIndexOf("/") + 1)
            let updatedTitle = str.replaceAll("%20", " ")
            playingTrack = updatedTitle
            currentSrc = document.querySelector("ul").querySelector("li").firstElementChild.innerHTML
            document.querySelector(".songTitle").innerHTML = document.querySelector("ul").querySelectorAll("li")[0].firstElementChild.innerHTML
            currentSong.src = songs[0]
            currentSong.play()
        }
        else {
            currentSong.src = songs[index - 1]
            let str = songs[index - 1].slice(songs[index - 1].lastIndexOf("/") + 1)
            let updatedTitle = str.replaceAll("%20", " ")
            audioOngoing = true
            playingTrack = updatedTitle
            currentSrc = document.querySelector("ul").querySelector("li").firstElementChild.innerHTML
            currentLi = document.querySelector("ul").querySelectorAll("li")[index - 1].lastElementChild
            currentLi.src = "Svgs/pause.svg"
            document.querySelector(".songTitle").innerHTML = document.querySelector("ul").querySelectorAll("li")[index - 1].firstElementChild.innerHTML
            previousLi.src = "Svgs/play.svg"
            previousLi = currentLi
            currentSong.play()
            document.querySelector(".songsControllerPlaySvg").src = "Svgs/pause.svg"
        }
    })

    //Adding AddEventListener to Next Button
    document.querySelector(".controllerSvgs").lastElementChild.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src)
        if (!songs[index + 1] || index < 0) {
            if (index < 0) {
                audioOngoing = true
                let str = songs[0].slice(songs[0].lastIndexOf("/") + 1)
                let updatedTitle = str.replaceAll("%20", " ")
                playingTrack = updatedTitle
                currentSrc = playingTrack
                currentLi = document.querySelector("li").lastElementChild
                previousLi = currentLi
                document.querySelector("li").lastElementChild.src = "Svgs/pause.svg"
                document.querySelector(".songsControllerPlaySvg").src = "Svgs/pause.svg"
                document.querySelector(".songTitle").innerHTML = document.querySelector("ul").querySelectorAll("li")[index + 1].firstElementChild.innerHTML
                currentSong.src = songs[0]
                currentSong.play()
            }
            else {
                audioOngoing = false
                currentSong.pause()
                currentLi.src = "Svgs/play.svg"
                document.querySelector(".songsControllerPlaySvg").src = "Svgs/play.svg"
            }
        }
        else {
            let str = songs[index + 1].slice(songs[index + 1].lastIndexOf("/") + 1)
            let updatedTitle = str.replaceAll("%20", " ")
            audioOngoing = true
            playingTrack = updatedTitle
            currentSrc = playingTrack
            currentLi = document.querySelector("ul").querySelectorAll("li")[index + 1].lastElementChild
            currentLi.src = "Svgs/pause.svg"
            previousLi.src = "Svgs/play.svg"
            document.querySelector(".songTitle").innerHTML = document.querySelector("ul").querySelectorAll("li")[index + 1].firstElementChild.innerHTML
            document.querySelector(".songsControllerPlaySvg").src = "Svgs/pause.svg"
            currentSong.src = songs[index + 1]
            previousLi = currentLi
            currentSong.play()
        }
    })

    //Adding Evenlistener "timeupdate" for updation and duration of time of a song
    currentSong.addEventListener("timeupdate", (e) => {
        let current = formatTime(Math.floor(e.target.currentTime));
        let duration = isNaN(e.target.duration) || e.target.duration === Infinity
            ? "--:--"
            : formatTime(Math.floor(e.target.duration));

        document.querySelector(".songDuration").innerHTML = `${current}/${duration}`;
        document.querySelector(".circleController").style.left = e.target.currentTime / e.target.duration * 100 + "%"
        document.querySelector(".fillUpLine").style.width = e.target.currentTime / e.target.duration * 100 + "%"
        if (currentSong.currentTime === currentSong.duration) {
            audioOngoing = false
            document.querySelector(".songsControllerPlaySvg").src = "Svgs/play.svg"
            currentLi.src = "Svgs/play.svg"
        }
    });

    //Addding Event Listener to Seekbar
    document.querySelector(".seekbaar").addEventListener("click", e => {
        let percent = (e.offsetX / e.currentTarget.getBoundingClientRect().width) * 100
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })


    //Adding an EventListener to Hamburger
    document.querySelector(".hamburgerSvg").addEventListener("click", () => {
        if (document.querySelector(".leftBox").style.left === "0px") {
            document.querySelector(".leftBox").style.left = "-300px"
        }
        else {
            document.querySelector(".leftBox").style.left = "0"
        }
    })


    //Adding an Event Listener to Input tag of Volume Control Button
    document.querySelector(".volumeRange").addEventListener("change", (e) => {
        if (e.target.value == 0) {
            document.querySelector(".volume").firstElementChild.src = "Svgs/volumeOf.svg"
        }
        else {
            document.querySelector(".volume").firstElementChild.src = "Svgs/volumeOn.svg"
        }
        currentSong.volume = e.target.value / 100
    })

    //Adding an Event Listener to Volume Svg
    document.querySelector(".volume").firstElementChild.addEventListener("click", (e) => {
        if (e.target.src.includes('Svgs/volumeOn.svg')) {
            e.currentTarget.src = "Svgs/volumeOf.svg"
            currentSong.volume = 0
            document.querySelector(".volumeRange").value = 0
        }
        else {
            e.currentTarget.src = "Svgs/volumeOn.svg"
            currentSong.volume = 1
            document.querySelector(".volumeRange").value = 100

        }
    })


    //Adding an Event Listener to Close Svg of Song Controller
    document.querySelector(".close").addEventListener("click", (e) => {
        document.querySelector(".songController").style.bottom = "-300px"
        document.querySelector(".showSongControllerArrow").style.display = "block"
    })


    document.querySelector(".showSongControllerArrow").addEventListener("click", (e) => {
        document.querySelector(".songController").style.bottom = "0px"
        document.querySelector(".showSongControllerArrow").style.display = "none"
    })


    //Adding an Event Listener to Remove Left Box by clicking outside of "leftBox"
    document.querySelector(".leftBox").addEventListener("transitionend", () => {
        const media = window.matchMedia("(max-width: 900px) and (max-height: 950px)")
        if (media.matches) {
            if (document.querySelector(".leftBox").style.left === "0px") {
                document.querySelector(".overlayDiv").style.display = "block"
                document.querySelector(".overlayDiv").addEventListener("click", hamburgerController)
            }
        }
    })

    //Adding an Event Listener to for scroll horizontally
    let artistsCards = document.querySelectorAll(".artistsCards")
    artistsCards.forEach(e => {
        e.addEventListener("wheel", (event) => {
            if (e.scrollWidth > e.clientWidth) {
                event.preventDefault();
                e.scrollLeft += event.deltaY;
            }
        })
    })

    //Adding Event Listener for showing loader for Songs
    currentSong.addEventListener("waiting", (e) => {
        document.querySelector(".loader").style.display = "block";
    });

    //Adding Event Listener for showing off loader when Song is fully Loaded
    currentSong.addEventListener("canplay", () => {
        document.querySelector(".loader").style.display = "none";
    });

    //Adding Event Listener to 'rightBox', will only appear if image of it loaded
    document.querySelector(".rightBox").querySelector("img").onload = () => {
        document.querySelector(".loaderContainerRightBox").style.display = "none"
        document.querySelector(".rightBox").style.display = "block"
    }

    //Adding an Page Loader
    let rightImg = document.querySelector(".rightBox").querySelectorAll("img")
    let img = document.querySelector("nav").querySelectorAll("img")
    let imageLoaded = 0;
    img.forEach(e => {
        if (e.complete) {
            imageLoaded++

        }
        else {
            e.onload = () => {
                imageLoaded++
            }
        }
        if (imageLoaded === img.length) {
            document.querySelector("nav").style.display = "flex"
            document.querySelector(".mainContainer").style.display = "flex"
            document.querySelector(".leftBox").style.display = "block"
            document.querySelector(".footerBanner").style.display = "flex"
            document.querySelector(".songController").style.display = "flex"
            document.querySelector(".navLoaderContainer").style.display = "none"
            document.querySelector(".loaderContainerRightBox").style.display = "flex"
        }
    })

}

main()
