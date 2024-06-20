/**
 * jspsych-html-button-response
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/



function updateResults(text, textAreaElement) {
    if (!textAreaElement) { textAreaElement = taStatusResults; }
    textAreaElement.value += ' \n\n' + text;
    textAreaElement.scrollTop = textAreaElement.scrollHeight;
}

function addIdToHTMLString(str,idToInsert) {
  idStr = 'id="' +  idToInsert + '"';

  // Find the position of the first ">"
  let position = str.indexOf('>');

  // Insert the id attribute before the first ">"
  let newStr = str.slice(0, position) + ' ' + idStr + str.slice(position);

  return newStr

}

async function init() {

  let video = document.getElementById('video');

    updateResults('Init has been called!', taStatusResults);
    updateResults('Please wait until Init finishes!', taStatusResults);
    document.getElementById('btInit').disabled = true;
    /* Configuration of ExperienceSDK */
    var reConfig = {
        autoStart: false,
        accountHash: '3TFXMS',
        predictionPerSecondLimit: 2,
    };
    /* End of configuration of ExperienceSDK*/
    /* Access camera stream */
    cameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
            width: {
                min: 320,
                ideal: 640
            },
            height: {
                min: 240,
                ideal: 480
            },
            facingMode: {
                ideal: "user"
            },
        },
        audio: false,
    });
    /* End of access camera stream*/
    /* Start ExperianceSDK */
    reConfig.cameraStream = cameraStream;
    window.Realeyesit.experienceSdk.init(reConfig);
    /* Subscribe to facial expression detected event and error event available events */
    window.Realeyesit.experienceSdk.on('facialExpressionsDetected', (params) => {
        max_emotion = null
        max_prob = 0
        //console.log(params.results.predictions)

        var x = ["PLACEHOLDER"]
        var y = [100]

        for (predict in params.results.predictions) {
            for (elem in params.results.predictions[predict]) {
                if (elem == 'linear') {
                    //if (params.results.predictions[predict][elem] > max_prob) {
                    x.push(predict)
                    y.push(Math.round(params.results.predictions[predict][elem] * 100) + "")
                    //console.log(params.results.predictions[predict][elem] * 100)
                }
            }
        }

        var data = [
            {
                histfunc: "count",
                y: y,
                x: x,
                type: "bar",
                name: "count",
            }
        ]

        console.log(x)
        console.log(y)

        //updateResults(max_prob,taFacialExpressionResults)
         
    });
    window.Realeyesit.experienceSdk.error((err) => {
        updateResults(' \n\n Error occurred: ' + JSON.stringify(err), taStatusResults);
    });
    /*Init mirror*/

    video.setAttribute('playsinline', '');
    video.playsinline = '';
    video.setAttribute('muted', '');
    video.controls = true;
    video.muted = true;
    video.autoplay = true;
    video.srcObject = this.cameraStream;
    const loadedMetadataHandler = () => {
        this.video.play();
    };
    if (video.onloadedmetadata) {
        video.onloadedmetadata = loadedMetadataHandler;
    }
    video.addEventListener('loadedmetadata', loadedMetadataHandler);
    /* End of init mirror*/
    /* Activate user interface */
    divSdk.style.visibility = 'visible';
}

/* Controls */
async function stop() {
    updateResults('Stop has been called!');
    try {
        window.Realeyesit.experienceSdk.stop(false);
        document.getElementById('btStart').disabled = false;
        document.getElementById('btStop').disabled = true;
    } catch (error) {
        updateResults(`Error ${error}`);
    }
}

async function start() {
    updateResults('Start has been called!');
    try {
        window.Realeyesit.experienceSdk.start();
        document.getElementById('btStart').disabled = true;
        document.getElementById('btStop').disabled = false;
    } catch (error) {
        updateResults(`Error ${error}`);
    }
}

jsPsych.plugins["custom-realeyes-plugin"] = (function() {

    var plugin = {};

    jsPsych.pluginAPI.registerPreload("custom-realeyes-plugin", 'stimulus', 'choices');
  
    plugin.info = {
      name: "custom-realeyes-plugin",
      description: '',
      parameters: {
        stimulus: {
          type: jsPsych.plugins.parameterType.HTML_STRING,
          pretty_name: 'Stimulus',
          default: undefined,
          description: 'The HTML string to be displayed'
        },
        choices: {
          type: jsPsych.plugins.parameterType.STRING,
          pretty_name: 'Choices',
          default: undefined,
          array: true,
          description: 'The labels for the buttons.'
        },
        button_html: {
          type: jsPsych.plugins.parameterType.STRING,
          pretty_name: 'Button HTML',
          default: '<button class="jspsych-btn">%choice%</button>',
          array: true,
          description: 'The html of the button. Can create own style.'
        },
        prompt: {
          type: jsPsych.plugins.parameterType.STRING,
          pretty_name: 'Prompt',
          default: null,
          description: 'Any content here will be displayed under the button.'
        },
        stimulus_duration: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Stimulus duration',
          default: null,
          description: 'How long to hide the stimulus.'
        },
        trial_duration: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Trial duration',
          default: null,
          description: 'How long to show the trial.'
        },
        margin_vertical: {
          type: jsPsych.plugins.parameterType.STRING,
          pretty_name: 'Margin vertical',
          default: '0px',
          description: 'The vertical margin of the button.'
        },
        margin_horizontal: {
          type: jsPsych.plugins.parameterType.STRING,
          pretty_name: 'Margin horizontal',
          default: '8px',
          description: 'The horizontal margin of the button.'
        },
        response_ends_trial: {
          type: jsPsych.plugins.parameterType.BOOL,
          pretty_name: 'Response ends trial',
          default: true,
          description: 'If true, then trial will end when user responds.'
        },
      }
    }
  
    plugin.trial = function(display_element, trial) {

      window.Realeyesit.experienceSdk.on('initDone', () => {
        btInit.disabled = true;
        btStart.disabled = false;
        updateResults('InitDone event happened!', taStatusResults);
        updateResults('Your sourceId is: ' + window.Realeyesit.experienceSdk.getSourceId(), taStatusResults);
    });
    window.Realeyesit.experienceSdk.on('preloadDone', () => {
        updateResults('PreloadDone event happened!', taStatusResults);
    });
    window.Realeyesit.experienceSdk.on('cameraPermissionAccessed', () => {
        updateResults('CameraPermissionAccessed event happened!', taStatusResults);
    });
    window.Realeyesit.experienceSdk.on('cameraPermissionDenied', () => {
        updateResults('CameraPermissionDenied event happened!');
    });
  
      // display stimulus
      var html = '<div id="jspsych-html-button-response-stimulus">'+trial.stimulus+'</div>';
  
      html += ` <div id="divSdk">
        <div id="divFeedback">
        <div style="display: inline-block; width: 45%">
            <h2>Mirror</h2>
            <video id="video" width="320" height="240" style="border: 1px solid;"></video>
        </div>
        <div style="display: inline-block; width: 45%">
            <h2>Information</h2>
            <textarea style="width: 320px; height: 240px;" id="taStatusResults"></textarea>
        </div>
        </div>
        <div id="divResults" style="width: 100%;">
            <h2>Facial expression results</h2>
            <br />
            <textarea style="width: 85%; height: 800px;" id="taFacialExpressionResults"></textarea>
        </div>
    </div>`

      //display buttons
      var buttons = [];
      if (Array.isArray(trial.button_html)) {
        if (trial.button_html.length == trial.choices.length) {
          buttons = trial.button_html;
        } else {
          console.error('Error in html-button-response plugin. The length of the button_html array does not equal the length of the choices array');
        }
      } else {
        for (var i = 0; i < trial.choices.length; i++) {
          buttons.push(trial.button_html);
        }
      }
      html += '<div id="jspsych-html-button-response-btngroup">';
      for (var i = 0; i < trial.choices.length; i++) {
        var str = buttons[i].replace(/%choice%/g, trial.choices[i]);
        if (i == 0) {
            str = addIdToHTMLString(str,"btInit")
        } else if (i == 1) {
            str = addIdToHTMLString(str,"btStart")
        } else if (i == 2) {
            str = addIdToHTMLString(str,"btStop")
        }
        html += '<div class="jspsych-html-button-response-button" style="display: inline-block; margin:'+trial.margin_vertical+' '+trial.margin_horizontal+'" id="jspsych-html-button-response-button-' + i +'" data-choice="'+i+'"';

        if (i == 0) {
            html += `onclick= "init()"`
        } else if (i == 1) {
            html += `onclick= "start()"`
        } else if (i == 2) {
            html += `onclick= "stop()"`
        }

        html += '>'+str+'</div>'
      }
      html += '</div>';

      //show prompt if there is one
      if (trial.prompt !== null) {
        html += trial.prompt;
      }
      display_element.innerHTML = html;
  
      // start time
      var start_time = Date.now();
  
      // add event listeners to buttons
      for (var i = 0; i < trial.choices.length; i++) {
        display_element.querySelector('#jspsych-html-button-response-button-' + i).addEventListener('click', function(e){
          var choice = e.currentTarget.getAttribute('data-choice'); // don't use dataset for jsdom compatibility
          after_response(choice);
        });
      }
  
      // store response
      var response = {
        rt: null,
        button: null
      };
  
      // function to handle responses by the subject
      function after_response(choice) {
  
        // measure rt
        var end_time = Date.now();
        var rt = end_time - start_time;
        response.button = choice;
        response.rt = rt;
  
        // after a valid response, the stimulus will have the CSS class 'responded'
        // which can be used to provide visual feedback that a response was recorded
        display_element.querySelector('#jspsych-html-button-response-stimulus').className += ' responded';
  
        // disable all the buttons after a response
        var btns = document.querySelectorAll('.jspsych-html-button-response-button button');
        for(var i=0; i<btns.length; i++){
          //btns[i].removeEventListener('click');
          btns[i].setAttribute('disabled', 'disabled');
        }
  
        if (trial.response_ends_trial) {
           //end_trial();
        }
        if (choice == 1) {
          end_trial();
        }
      };
  
      // function to end trial when it is time
      function end_trial() {
  
        // kill any remaining setTimeout handlers
        jsPsych.pluginAPI.clearAllTimeouts();
  
        // gather the data to store for the trial
        var trial_data = {
          "rt": response.rt,
          "stimulus": trial.stimulus,
          "button_pressed": response.button
        };
  
        // clear the display
        display_element.innerHTML = '';
  
        // move on to the next trial
        jsPsych.finishTrial(trial_data);
      };
  
      // hide image if timing is set
      if (trial.stimulus_duration !== null) {
        jsPsych.pluginAPI.setTimeout(function() {
          display_element.querySelector('#jspsych-html-button-response-stimulus').style.visibility = 'hidden';
        }, trial.stimulus_duration);
      }
  
      // end trial if time limit is set
      if (trial.trial_duration !== null) {
        jsPsych.pluginAPI.setTimeout(function() {
          end_trial();
        }, trial.trial_duration);
      }
  
    };
  
    return plugin;
    
  })();
  