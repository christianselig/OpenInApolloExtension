var handledURL = "";
var isAutomatic = true;

function runCheck() {
    if (handledURL == window.location.href) {
        // Already handled, don't want to repeat.
        return;
    }
    
    const regexRedditIDs = /^(?:https?:\/\/)?(?:(?:www|amp|m|i)\.)?(?:(?:reddit\.com))\/r\/(\w+)(?:\/comments\/(\w+)(?:\/\w+\/(\w+)(?:\/?.*?[?&]context=(\d+))?)?)?/i;
    const match = window.location.href.match(regexRedditIDs);

    if (match) {
        handledURL = window.location.href;
        window.stop();

        const subreddit = match[1];
        const postID = match[2];
        const commentID = match[3];
        const context = match[4];

       // postID, commentID, context can be NULL, but subreddit should never be
        if (postID && commentID && context) {
            if (isAutomatic) {
                window.location.replace(`https://openinapollo.com?subreddit=${subreddit}&postID=${postID}&commentID=${commentID}&context=${context}`);
            } else {
                window.location.replace(`apollo://reddit.com/r/${subreddit}/comments/${postID}/_/${commentID}/?context=${context}`);
            }
        } else if (postID && commentID) {
            if (isAutomatic) {
                window.location.replace(`https://openinapollo.com?subreddit=${subreddit}&postID=${postID}&commentID=${commentID}`);
            } else {
                window.location.replace(`apollo://reddit.com/r/${subreddit}/comments/${postID}/_/${commentID}`);
            }
        } else if (postID) {
            if (isAutomatic) {
                window.location.replace(`https://openinapollo.com?subreddit=${subreddit}&postID=${postID}`);
            } else {
                window.location.replace(`apollo://reddit.com/r/${subreddit}/comments/${postID}`);
            }
        } else {
            if (isAutomatic) {
                window.location.replace(`https://openinapollo.com?subreddit=${subreddit}`);
            } else {
                window.location.replace(`apollo://reddit.com/r/${subreddit}`);
            }
        }
    }
}

browser.storage.local.get((item) => {
    var automaticObj = item.automaticObj;

    if (automaticObj == undefined) {
        isAutomatic = true;
    } else {
        isAutomatic = automaticObj.isAutomatic;
    }

    // Run both on extension being created (on page load) as well as when DOM nodes are inserted because Reddit does dynamic JavaScript content insertion similar to how AMP operates
    runCheck();
    document.addEventListener("DOMNodeInserted", function(event) {
        runCheck();
    });
})
