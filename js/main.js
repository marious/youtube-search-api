(function($) {
    "use strict";

    // Search bar Handler
    const searchField = $('#query');
    const icon = $('#search-btn');

    // object data that will be send to api 
    let sendObj = {
        part: "snippet, id",
        q: null,
        maxResults: 10,
        type: 'video',
        key: "AIzaSyDGUlc69_YTNK81VrWcynOKWoltXScb0s8",
    };


    // Focus Event Handler 
    searchField.on('focus', () => {
       searchField.animate({
           width: '100%',
       }, 400);
       icon.animate({
           right: '10px'
       }, 400);
    });

 // Blur Event Hanler
 searchField.on('blur', () => {
        if (searchField.val() === '') {
            $(searchField).animate({
                width: '45%',
            }, 400);
            icon.animate({
                right: '360px',
            }, 400);
        }
    });

// Handle submit form
$('#search-form').on('submit', function(e) {
    e.preventDefault();
    search(sendObj);
});


function search(senderObj) {
     // Get form input search 
    let q = $('#query').val();
    senderObj.q = q;

    // Clear results 
    $('#results').html('');
    $('#buttons').html('');

    // Run GET Request on API 
    $.get("https://www.googleapis.com/youtube/v3/search", senderObj, (data) => {
        let nextPageToken = data.nextPageToken;
        let prevPageToken = data.prevPageToken;
        let output = '';
        // console.log(data); return;
        data.items.forEach(item => {
            output += getOutput(item);
        });
        // Dispaly results 
        $('#results').append(output);

        // get prev and next buttons
        let buttons = getButtons(prevPageToken, nextPageToken, q);
        // Display buttons 
        $('#buttons').append(buttons);

    });
}

// The next page
function nextPage(senderObj) {
    senderObj.pageToken = $('#next-button').data('token');
    senderObj.q = $('#next-button').data('query');

    search(senderObj);
}

// The previous page
function prevPage(senderObj) {
    senderObj.pageToken = $('#prev-button').data('token');
    senderObj.q = $('#prev-button').data('query');

    search(senderObj);
}

// Build output
function getOutput(item) {
    let data = {
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumb: item.snippet.thumbnails.high.url,
        channelTitle: item.snippet.channelTitle,
        videoDate: item.snippet.publishedAt,
    };

    // Build output string 
    let output = `
        <li>
            <div class="list-left">
                <img src="${data.thumb}">
            </div>
            <div class="list-right">
                <h3>
                    <a class="fancybox fancybox.iframe" href="http://www.youtube.com/embed/${data.videoId}">
                    ${data.title}
                    </a>
                </h3>
                <small>By <span class="cTitle">${data.channelTitle}</span> on ${data.videoDate}</small>
                <p>${data.description}</p>
            </div>
        </li>
        <div class="clearfix"></div>
    `;

    return output;

}

function getButtons(prevPageToken, nextPageToken, q) {
    let btnoutput;
    if (!prevPageToken) {
        btnoutput = `
            <div class="button-container">
                <button id="next-button" class="paging-button" data-token="${nextPageToken}" 
                    data-query="${q}">Next Page</button>
            </div>
        `; 
    } else {
        btnoutput = `
            <div class="button-container">
                <button id="prev-button" class="paging-button" data-token="${prevPageToken}" 
                data-query=${q}">Prev Page</button>
                 <button id="next-button" class="paging-button" data-token="${nextPageToken}" 
                    data-query="${q}">Next Page</button>
            </div>
        `;
    }

    return btnoutput;
}

// Handle clicking on next and prev page 
$('div#buttons').on('click', '#next-button', () => {
    nextPage(sendObj);
});

$('div#buttons').on('click', '#prev-button', () => {
    prevPage(sendObj);
});

}(jQuery));