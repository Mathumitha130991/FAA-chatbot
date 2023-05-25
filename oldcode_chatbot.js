function SendMessage()
{
        
var player = GetPlayer();
var message = player.GetVar("message");
var response = player.GetVar("response");
var chatHistory = player.GetVar("chatHistory");
const apiKey = player.GetVar("apiKey");
var ROLE = player.GetVar("role");
var question = message;
var URL = 'https://corsproxy.io/?' + encodeURIComponent('https://openai80.p.rapidapi.com/chat/completions');

message = "Act as a "+ROLE+". Answer my question in maximum 450 characters. My question is: "+message;
var apiInProgress = false;

function sendMessage() {
    if (apiInProgress) return;
    apiInProgress = true;

    // Set up API request
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": URL,
        "method": "POST",
        "headers": {
            "content-type": "application/json",
            "X-RapidAPI-Key": apiKey,
            "X-RapidAPI-Host": "openai80.p.rapidapi.com"
        },
        "processData": false,
        "data": JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "user",
                    "content": message
                }
            ]
        })
    };

    $.ajax(settings).done(function (response) {
        if (response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content) {
            var generatedResponse = response.choices[0].message.content.trim();
            player.SetVar("response", generatedResponse);
            player.SetVar("chatHistory", chatHistory + "\nMessage: " + question + "\nResponse: " + generatedResponse+"\n");           
            player.SetVar("message", "");
        } else {
            console.error("Unexpected API response:", JSON.stringify(response));
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error in API request:", textStatus, errorThrown);
    }).always(function() {        
        apiInProgress = false;
    });
}

sendMessage();

        
        
}

function CopyResponse()
{
        
        var player = GetPlayer();
        var response = player.GetVar("response");
        navigator.clipboard.writeText(response)
        .then(function() {
    console.log('Text copied to clipboard');
        })
        .catch(function(error) {
    console.error('Failed to copy text: ', error);
        });

}

function ExportChat()
{
        
var title = "Chat History";
var editor = GetPlayer().GetVar("chatHistory");
var blob = new Blob([editor], { type: 'application/msword' });
var downloadLink = document.createElement("a");
downloadLink.download = "Chat History" + ".doc";
downloadLink.innerHTML = "Download File";
downloadLink.href = window.URL.createObjectURL(blob);
document.body.appendChild(downloadLink);
downloadLink.click();
document.body.removeChild(downloadLink);      
}
