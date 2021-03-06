/*
 * JavaScript file for the application to demonstrate
 * using the API
 */

// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'run': function(driver_quality,this_car_cost,prop_cost,other_car_cost) {
            let ajax_options = {
                type: 'POST',
                url: 'api/insurance',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'driver_quality': driver_quality,
                    'this_car_cost': this_car_cost,
                    'prop_cost': prop_cost,
                    'other_car_cost': other_car_cost
                })
            };
            console.log(ajax_options.data);

            $.ajax(ajax_options)
            .done(function(data) {
                console.log('triggered model_create_success');
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                console.error('triggered model_error');
                console.error('xhr',xhr);
                console.error('textStatus',textStatus);
                console.error('errorThrown',errorThrown);
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    // return the API
    return {
        show_response: function(data) {

            var resposta = JSON.parse(data);

            console.log('resposta.response = '+resposta.response);

            let $response = $("#response");

            $response.removeClass('alert alert-primary');
            $response.removeClass('alert alert-secondary');
            $response.removeClass('alert alert-warning');
            $response.removeClass('alert alert-danger');

            if(resposta.response == 'None') {
                $response.html('Accident severity level: None.');
                $response.addClass('alert alert-primary');
                $response.css('visibility','visible');
            }

            if(resposta.response == 'Mild') {
                $response.html('Accident severity level: Mild.');
                $response.addClass('alert alert-secondary');
                $response.css('visibility','visible');
            }

            if(resposta.response == 'Moderate') {
                $response.html('Accident severity level: Moderate.');
                $response.addClass('alert alert-warning');
                $response.css('visibility','visible');
            }

            if(resposta.response == 'Severe') {
                $response.html('Accident severity level: Severe.');
                $response.addClass('alert alert-danger');
                $response.css('visibility','visible');
            }

            //alert($response.innerHTML);
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $driver_quality = $('#driver_quality'),
        $this_car_cost = $('#this_car_cost'),
        $prop_cost = $('#prop_cost'),
        $other_car_cost = $('#other_car_cost'),
        $response = $("#span_response");

    // Validate input
    function validate(driver_quality,this_car_cost,prop_cost,other_car_cost) {
        /*
        console.log('validate run');
        console.log('driver_quality: '+driver_quality);
        console.log('this_car_cost: '+this_car_cost);
        console.log('prop_cost: '+prop_cost);
        console.log('other_car_cost: '+other_car_cost);
        */
        return driver_quality !== "" && this_car_cost !== "" && prop_cost !== "" && other_car_cost !== "";
    }

    $('#run').click(function(e) {
        //alert('run was clicked!');
        let driver_quality = $driver_quality.val(),
            this_car_cost = $this_car_cost.val(),
            prop_cost = $prop_cost.val(),
            other_car_cost = $other_car_cost.val();

        e.preventDefault();

        if(validate(driver_quality,this_car_cost,prop_cost,other_car_cost)) {
            model.run(driver_quality,this_car_cost,prop_cost,other_car_cost);
        } else {
            alert('Please, select all options.');
        }
    })

    $event_pump.on('model_create_success', function(e, data) {
        //alert('model_create_success!');
        view.show_response(data);
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));

