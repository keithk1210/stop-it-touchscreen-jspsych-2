jsPsych.plugins["custom-stop-signal-plugin"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('custom-stop-signal-plugin', 'stimulus', 'image');

  function changeClass(htmlString, newClassName) {
    // Regular expression to find the class attribute of the element with id="jspsych-content"
    var regex = /(<div id="jspsych-content"[^>]*class=")([^"]*)(")/;
    
    // Replace the class attribute value with the new class name
    var modifiedHtmlString = htmlString.replace(regex, `$1${newClassName}$3`);
    console.log("modifiedHtmlString " +  modifiedHtmlString)
    return modifiedHtmlString;
  }

  plugin.info = {
    name: 'custom-stop-signal-plugin',
    description: '',
    parameters: {
      fixation: {
        type:  jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Fixation Sign',
        default: undefined,
        description: 'The fixation to be displayed'
      },
      fixation_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Fixation duration',
        default: null,
        description: 'Duration of the fixation.'
      },
      stimulus1: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'First stimulus',
        default: undefined,
        description: 'The first image to be displayed'
      },
      stimulus2: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Second stimulus',
        default: undefined,
        description: 'The second image to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.STRING,
        array: true,
        pretty_name: 'Choices',
        default: undefined,
        description: 'The labels of the buttons the subject can click to respond.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      ISI: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'Inter-Stimulus-Interval (delay of the second stimulus).'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    //var fix = '<img src="'+trial.fixation+'"id="jspsych-image-keyboard-response-stimulus" class="larger-img"></img>';
    var fix = `<div class="container">
      <img src="`+trial.fixation+`"id="jspsych-image-keyboard-response-stimulus" class="larger-img"></img>
      <img src="` + car_path+`" alt="Moving Image" id="moving-image">
      
    </div>`;

    var new_html = ` <div class="container">
                    <img src="` + trial.stimulus1 +`" class="larger-img">
                    <img src="` + car_path+`" alt="Moving Image" id="moving-image">
                    `;
    var new_html_2 = `  <div class="container">
                      <img src="` + trial.stimulus2 +`" class="larger-img">
                      <img src="` + car_path+`" alt="Moving Image" id="moving-image">
                      `;

    // add prompt
    // if (trial.prompt !== null){
    //   new_html += trial.prompt;
    // }

    // draw the first images
    display_element.innerHTML = fix

     var car_elem = document.getElementById('moving-image');
    //if (car_elem && trial.fixation_duration !== null) {
      console.log("Duration: " + (trial.fixation_duration/1000) + 's')
      console.log(car_elem)
      car_elem.style.animationDuration = (trial.fixation_duration/1000) + 's';
    //}

    
  
    console.log("Fix:\n" + display_element.outerHTML)

    // var element = document.getElementById('jspsych-content');
    // if (element) {
    //   element.classList.add('jspsych-content-trial')
    // }

    // store response
    var response = {
      rt: null,
      button: null
    };

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        "raw_rt": response.rt,
        "rt": response.rt - trial.fixation_duration,
        "first_stimulus": trial.stimulus1,
        "second_stimulus": trial.stimulus2,
        "onset_of_first_stimulus": trial.fixation_duration,
        "onset_of_second_stimulus": trial.ISI + trial.fixation_duration,
        "button_press": response.button
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(choice) {
      return function() {
        // record the time of the response
        var end_time = (new Date()).getTime();
        response.rt = end_time - start_time;
        response.button = choice;

        // after a valid response, the stimulus will have the CSS class 'responded'
        // which can be used to provide visual feedback that a response was recorded
        display_element.querySelector('#jspsych-image-keyboard-response-stimulus').className += ' responded';

        if (trial.response_ends_trial) {
          end_trial();
        }
      }
    };

    

    if (trial.fixation_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {

  
        // start the response listener
        var buttons_html = ' <div id="upper-left">';
        for (var i = 0; i < trial.choices.length; i++) {
          buttons_html += '<button class="jspsych-btn" id="jspsych-html-button-response-button-' + i +'" data-choice="'+i+'">'+trial.choices[i]+'</button>';
        }
        buttons_html += '</div> ';

        display_element.innerHTML = new_html + buttons_html + "</div>";

        console.log("Normal trial:\n" + display_element.outerHTML)

        // add event listeners to buttons
        for (var i = 0; i < trial.choices.length; i++) {
          display_element.querySelector('#jspsych-html-button-response-button-' + i).addEventListener('click', after_response(i));
        }
        
      }, trial.fixation_duration)
    }

    // hide first stimulus if ISI is set and this is a stop trial (if stim1 and stim2 differ)
    if (trial.stimulus1 != trial.stimulus2) {
      if (trial.ISI !== null) {
        jsPsych.pluginAPI.setTimeout(function() {

        
          // start the response listener
          var buttons_html = '<div id="upper-left">';
          for (var i = 0; i < trial.choices.length; i++) {
            buttons_html += '<button class="jspsych-btn" id="jspsych-html-button-response-button-' + i +'" data-choice="'+i+'">'+trial.choices[i]+'</button>';
          }
          buttons_html += '</div> ';

          display_element.innerHTML = new_html_2 + buttons_html + "</div>";

          console.log("Stop trial:\n" + display_element.outerHTML)

          // add event listeners to buttons
          for (var i = 0; i < trial.choices.length; i++) {
            display_element.querySelector('#jspsych-html-button-response-button-' + i).addEventListener('click', after_response(i));
          }
        }, trial.ISI + trial.fixation_duration);
      }
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration + trial.fixation_duration);
    }

    var start_time = (new Date()).getTime();
  };

  return plugin;
})();
