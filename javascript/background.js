console.log('addon initated in background');

jQuery(document).ready(function () {
    start();
});

var printButtonSelector = '.container button.indigo';
var recipeCardListSelector = '.container button.indigo';
var machineStepsSelector = "div.title";
var machienStepsFilter = ":contains('Machine Steps')";

function cToF(celsius) {
    var cTemp = celsius;
    var cToFahr = cTemp * 9 / 5 + 32;
    var message = cTemp + '\xB0C is ' + cToFahr + ' \xB0F.';
    // console.log(message);
    return cToFahr;
}

function fToC(fahrenheit) {
    var fTemp = fahrenheit;
    var fToCel = (fTemp - 32) * 5 / 9;
    var message = fTemp + '\xB0F is ' + fToCel + '\xB0C.';
    // console.log(message);
    return fToCel;
}

function getLocation(location) {
    if (location === "Pass Through") {
        return 1;
    } else if (location == "Mash") {
        return 2;
    } else if (location == "Adj 1") {
        return 3;
    } else if (location == "Adj 2") {
        return 4;
    } else if (location == "Adj 3") {
        return 5;
    } else if (location == "Adj 4") {
        return 6;
    } else if (location == "Pause") {
        return 7;
    }
}

function start() {
    if (window.location.pathname.startsWith("/recipe/recipes")) {

    } else if (window.location.pathname.startsWith("/recipe/edit")) {

    } else if (window.location.pathname.startsWith("/recipe/print"))

        var printButtonExists = setInterval(function () {
            if ($(printButtonSelector).length == 1) {
                console.log('print button found');
                clearInterval(printButtonExists);

                // grab existing print button
                var $print = $($(printButtonSelector)[0]);

                var $unitSelector = $print.prev();

                var $buttonGroup = $('<div></div>');
                $buttonGroup.addClass("mb-1 v-item-group theme--light");
                $buttonGroup.css("display", "inline");

                $buttonGroup.insertAfter($unitSelector);
                $buttonGroup.append($print)

                // clone print div and insert after existing print button
                var $upload = $print.clone();

                // change color and icon before adding to dom
                $upload.removeClass("indigo");
                $upload.addClass("green");
                $upload.find("span i")[0].innerText = "cloud_upload";

                $upload.insertAfter($print);

                // space out the calls to action
                $print.css("margin-left", "10px");
                $upload.css("margin-left", "10px");

                // example receipt json
                // {
                //     "IsBeer": true,
                //     "Name": "My Sample Recipe",
                //     "UsePicoPakMode": false,
                //     "Steps": [
                //       {
                //         "Name": "Heat Water",
                //         "StepType": 1,
                //         "Time": 0,
                //         "Location": 1,
                //         "Temp": 67.1,
                //         "Drain": 0
                //       },
                //       {
                //         "Name": "Mash",
                //         "StepType": 1,
                //         "Time": 5400,
                //         "Location": 2,
                //         "Temp": 67,
                //         "Drain": 480
                //       },
                //       {
                //         "Name": "Heat to Boil",
                //         "StepType": 1,
                //         "Time": 0,
                //         "Location": 1,
                //         "Temp": 97,
                //         "Drain": 0
                //       },
                //       {
                //         "Name": "Boil Adjunct 1",
                //         "StepType": 1,
                //         "Time": 2700,
                //         "Location": 3,
                //         "Temp": 97,
                //         "Drain": 0
                //       },
                //       {
                //         "Name": "Boil Adjunct 2",
                //         "StepType": 1,
                //         "Time": 300,
                //         "Location": 4,
                //         "Temp": 97,
                //         "Drain": 0
                //       },
                //       {
                //         "Name": "Boil Adjunct 3",
                //         "StepType": 1,
                //         "Time": 300,
                //         "Location": 5,
                //         "Temp": 97,
                //         "Drain": 0
                //       },
                //       {
                //         "Name": "Boil Adjunct 4",
                //         "StepType": 1,
                //         "Time": 300,
                //         "Location": 6,
                //         "Temp": 97,
                //         "Drain": 300
                //       }
                //     ]
                //   }

                var stepDivs = $(machineStepsSelector).filter(machienStepsFilter).nextAll();
                // console.log(stepDivs)

                var steps = [];
                stepDivs.each(function (index) {
                    if (index !== 0) {
                        var element = stepDivs[index];
                        // console.log(element);
                        if (element.innerText.indexOf("Name") === -1) {
                            var children = $(element).find("div form div div span");
                            // console.log(children);
                            // children[0] == name
                            // children[1] == temp
                            // children[2] == time
                            // children[3] == drain
                            // children[4] == location ("pass through", "mash", "Adj #", "pause")
                            steps.push({
                                "Name": children[0].innerText,
                                "StepType": 1,
                                "Time": parseInt(children[2].innerText, 10),
                                "Location": getLocation(children[4].innerText),
                                "Temp": fToC(parseInt(children[1].innerText, 10)),
                                "Drain": parseInt(children[3].innerText, 10)
                            })
                        }
                    }
                });

                console.log(steps);


                $upload.click(function () {
                    var recipeJson = {
                        "IsBeer": true, // support other types of brew sessions?
                        "Name": "My Sample Recipe", // pull name from recipe
                        "UsePicoPakMode": false,
                        "Steps": steps
                    };
                    console.log(recipeJson);

                    // need to get around mix content http vs https???
                    // maybe use mitmproxy to redirect https -> http?
                    $.post("http://192.168.42.11/recipe", recipeJson)
                })
            }
        }, 500); // check for top navigation every 100ms
}