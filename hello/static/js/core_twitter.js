document.onreadystatechange = function () {
if (document.readyState == "complete") {
    var is_auth = false;
    var is_reg = false;
    var upd_twit_id = null;
    var upd_twit_text = null;


    $("body").on("click", "#registration_link", function(event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            $.ajax({
                url: '/reg/',
                method: "GET",
                dataType: "html",         
                
                success: function(data) 
                {
                    $("body").html(data)

                },
                error: function()
                {
                    alert("ERROR")
                }
            });
            return false;
    }); 

    $("body").on("change", "#auth_form", function(event) {
        if (is_auth == true)
        {
            $("#enter_username_div").removeClass('has-error has-feedback');
            $("#password_div").removeClass('has-error has-feedback');
            $("#glyphicon_remove").remove();
            $("#glyphicon_remove").remove();
            is_auth = false;
        }
        return false;
    });

    $("body" ).on("submit", "#auth_form", function(event) {
        $.ajax({
            url: $(this).attr('action'),
            method: $(this).attr('method'),            
            data: $(this).serialize(),  
            dataType: "html",
            success: function(data) 
            { 
                if (data == "UNCORECT_USER")
                {                           

                    $("#enter_username_div").addClass('has-error has-feedback');
                    $("#hor_user_div").append('<span id="glyphicon_remove" class="glyphicon glyphicon-remove form-control-feedback"></span>');

                    $("#password_div").addClass('has-error has-feedback');
                    $("#hor_pass_div").append('<span id="glyphicon_remove" class="glyphicon glyphicon-remove form-control-feedback"></span>');
                    is_auth = true;
                }
                else
                {
                    var reg_json = JSON.parse(data)
                    $(reg_json.where).html(reg_json.what)
                }
            },
            error: function()
            {
                alert("ERROR")
            }
        });
        return false;
    });

    $("body").on("submit", "#reg_form", function(event) {
        clearregform()
        $.ajax({
            url: '/regform/',
            method: $(this).attr('method'),            
            data: $(this).serialize(),  
            dataType: "html",
            success: function(data) 
            {
                //$("#root_message").html(data)
                var mes_json = JSON.parse(data);
                allmes_reg(mes_json)

                if(mes_json.password1.status == 'ok' && mes_json.password2.status == 'ok' && mes_json.username.status == 'ok')
                {   
                    $.ajax({
                        url: '/reg/',
                        method: $(this).attr('method'),            
                        data: $("#reg_form").serialize(),  
                        dataType: "html",
                        success: function(data) 
                        {   
                            var reg_json = JSON.parse(data)
                            if ("username" in reg_json)
                            {   
                                allmes_reg(reg_json)
                            }
                            if ("where" in reg_json && "what" in reg_json)
                            {
                                $(reg_json.where).html(reg_json.what)
                            } 
                            
                        },
                        error: function()
                        {
                            alert("ERROR")
                        }
                    });
                   
                }
            },
            error: function()
            {
                alert("ERROR")
            }
        });
        return false;
    });

    $("body" ).on("submit", "#logout", function(event) {
        $.ajax({
            url: $(this).attr('action'),
            method: $(this).attr('method'),            
            data: $(this).serialize(),  
            dataType: "html",
            success: function(data) 
            { 
                var reg_json = JSON.parse(data)
                $(reg_json.where).html(reg_json.what)
            },
            error: function(){ alert("ERROR") }
        });
        return false;
    });

    $("body").on("change", "#reg_username", function(event) {
        clearregform_user()        
        $.ajax({
            url: '/regform/',
            method: "POST",            
            data: $('#reg_form').serialize(),  
            dataType: "html",
            success: function(data) 
            {
                //$("#root_message").html(data)
                var mes_json = JSON.parse(data);
                if(mes_json.username.status == 'ok')
                {
                    $("#reg_username_div").addClass('has-success has-feedback');
                    $("#hor_user_div").append('<span id="glyphicon_username" class="glyphicon glyphicon-ok form-control-feedback"></span>');   
                }

                if(mes_json.username.status == 'false')
                {
                    $("#reg_username_div").addClass('has-error has-feedback');
                    $("#hor_user_div").append('<span id="glyphicon_username" class="glyphicon glyphicon-remove form-control-feedback"></span>');
                    $("#hor_user_mg").append('<label class="help-block">'+mes_json.username.message+'</label>');
                }

            },
            error: function()
            {
                alert("ERROR")
            }
        });
        return false;
    });

    $("body").on("change", "#password_div_1", function(event) {
        clearregform_pas1()
        $.ajax({
            url: '/regform/',
            method: "POST",            
            data: $('#reg_form').serialize(),  
            dataType: "html",
            success: function(data) 
            {
                //$("#root_message").html(data)
                var mes_json = JSON.parse(data);
                if(mes_json.password1.status == 'false' && document.getElementById("password_2").value != '')
                {
                    $("#password_div_1").addClass('has-error has-feedback');

                    $("#hor_pass_div_1").append('<span id="glyphicon_pass_1" class="glyphicon glyphicon-remove form-control-feedback"></span>');

                    $("#hor_pas1_mg").append('<label class="help-block">'+mes_json.password1.message+'</label>');
                }
                
            },
            error: function()
            {
                alert("ERROR")
            }
        });
        return false;
    });

    $("body").on("change", "#password_div_2", function(event) {
        clearregform_pas1()
        clearregform_pas2()
        $.ajax({
            url: '/regform/',
            method: "POST",            
            data: $('#reg_form').serialize(),  
            dataType: "html",
            success: function(data) 
            {
                //$("#root_message").html(data)
                var mes_json = JSON.parse(data);
                
                if(mes_json.password1.status == 'ok' && mes_json.password2.status == 'ok')
                {
                    $("#password_div_1").addClass('has-success has-feedback');
                    $("#hor_pass_div_1").append('<span id="glyphicon_pass_1" class="glyphicon glyphicon-ok form-control-feedback"></span>');

                    $("#password_div_2").addClass('has-success has-feedback');
                    $("#hor_pass_div_2").append('<span id="glyphicon_pass_2" class="glyphicon glyphicon-ok form-control-feedback"></span>'); 
                }
                
                if(mes_json.password1.status == 'false')
                {
                    $("#password_div_1").addClass('has-error has-feedback');
                    $("#password_div_2").addClass('has-error has-feedback');

                    $("#hor_pass_div_1").append('<span id="glyphicon_pass_1" class="glyphicon glyphicon-remove form-control-feedback"></span>');
                    $("#hor_pass_div_2").append('<span id="glyphicon_pass_2" class="glyphicon glyphicon-remove form-control-feedback"></span>');

                    $("#hor_pas1_mg").append('<label class="help-block">'+mes_json.password1.message+'</label>');
                    $("#hor_pas2_mg").append('<label class="help-block">'+mes_json.password2.message+'</label>');
                }
                
            },
            error: function()
            {
                alert("ERROR")
            }
        });
        return false;
    });

    $("body").on("submit", "#send_post", function(event) {
        $.ajax({
            url: $(this).attr('action'),
            method: $(this).attr('method'),            
            data: $(this).serialize(),  
            dataType: "html",
            success: function(data) 
            {  
                var twit_json = JSON.parse(data)                
                new_twit = add_twittolist(twit_json.id, twit_json.twit, twit_json.date)
                $('#list_twit').append(new_twit)
                document.getElementById("new_twit_text").value = ""
                
            },
            error: function(){ alert("ERROR") }
        });
        return false;
    });

    $('body').on('click', 'a[href^=\\/twit\\/del]', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();
        event.stopPropagation();
        var url = $(this).attr('href');
        var id = $(this).attr('id');
        var name = $(this).attr('name');
        var $csrftoken = getCookie('csrftoken');
        $.ajax({
            url: url,
            method: "POST",
            data: {"del": id },
            dataType: "html",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("X-CSRFToken", $csrftoken);
            },
            success: function(data) 
            {  
                var twit_json = JSON.parse(data);
                if ("del_twit" in twit_json )
                {
                    $(twit_json.del_twit).slideToggle(350);
                }
                
            },
            error: function(){ alert("ERROR") }
        });
        return false;
    });

    $('body').on('click', 'a[href^=\\/twit\\/upd]', function(event) {
        event.stopImmediatePropagation();
        event.preventDefault();
        event.stopPropagation();

        var url = $(this).attr('href');
        var id = $(this).attr('id');
        var name = $(this).attr('name');
        
        if(upd_twit_id == null && upd_twit_text == null)
        {
            edit_dict = upd_twitform(id);
            upd_twit_id = edit_dict['id'];
            upd_twit_text = edit_dict['edit_twit'];

            $("#upd_"+upd_twit_id).hide();
            $("#del_"+upd_twit_id).hide();
            $("#twi_text_"+upd_twit_id).hide();
        }
        else
        {            
            edit_animate('#upd_twi_'+upd_twit_id, "#ff817f")
            edit_animate('#upd_twi_'+upd_twit_id, "#ffffff")
        }
        return false;
    });



    function edit_animate(parent_id, color)
    {
        $(parent_id).animate(
        {
            backgroundColor: color

        }, 700 );
    }


    $('body').on('click', 'button[id=confirm_twit_edit]', function(event) {
        event.preventDefault();
        event.stopPropagation();

        if( upd_twit_text == document.getElementById( 'upd_twi_'+upd_twit_id ).value )
        {
            twit_form_back(upd_twit_id, upd_twit_text)
        }
        else
        {   
            new_twi = document.getElementById( 'upd_twi_'+upd_twit_id ).value
            twi_data = {
                "upd_id": upd_twit_id,
                "text_twit": new_twi  
            }

            $.ajax({
                url: 'twit/upd/',
                method: "post",            
                data: twi_data,  
                dataType: "html",
                success: function(data) 
                { 
                    twit_form_back(upd_twit_id, new_twi)
                },
                error: function()
                { 
                    twit_form_back(upd_twit_id, upd_twit_text) 
                }
            });
           
        }
        return false;
    });


    $('body').on('click', 'button[id=cansel_twit_edit]', function(event) {
        event.preventDefault();
        event.stopPropagation();

        twit_form_back(upd_twit_id, upd_twit_text)
        return false;
    });


    function clearregform()
    { 
        $("#reg_username_div").removeClass('has-error has-success has-feedback ');
        $("#password_div_1").removeClass('has-error has-success has-feedback ');
        $("#password_div_2").removeClass('has-error has-success has-feedback ');

        $("#glyphicon_username").remove();
        $("#glyphicon_pass_1").remove();
        $("#glyphicon_pass_2").remove();

        $("#hor_user_mg").empty()
        $("#hor_pas1_mg").empty()
        $("#hor_pas2_mg").empty()

    }

    function clearregform_user()
    {
        $("#reg_username_div").removeClass('has-error has-success has-feedback ');
        $("#glyphicon_username").remove();
        $("#hor_user_mg").empty()
    }

    function clearregform_pas1()
    {
        $("#password_div_1").removeClass('has-error has-success has-feedback ');
        $("#glyphicon_pass_1").remove();
        $("#hor_pas1_mg").empty()
    }

    function clearregform_pas2()
    {
        $("#password_div_2").removeClass('has-error has-success has-feedback ');
        $("#glyphicon_pass_2").remove();
        $("#hor_pas2_mg").empty()
    }

    function allmes_reg(mes_json)
    {
    if(mes_json.username.status == 'ok')
    {
        $("#reg_username_div").addClass('has-success has-feedback');
        $("#hor_user_div").append('<span id="glyphicon_username" class="glyphicon glyphicon-ok form-control-feedback"></span>');   
    }

    if(mes_json.username.status == 'false')
    {
        $("#reg_username_div").addClass('has-error has-feedback');
        $("#hor_user_div").append('<span id="glyphicon_username" class="glyphicon glyphicon-remove form-control-feedback"></span>');
        $("#hor_user_mg").append('<label class="help-block">'+mes_json.username.message+'</label>');
    }

    if(mes_json.password1.status == 'ok' && mes_json.password2.status == 'ok')
    {
        $("#password_div_1").addClass('has-success has-feedback');
        $("#hor_pass_div_1").append('<span id="glyphicon_username" class="glyphicon glyphicon-ok form-control-feedback"></span>');

        $("#password_div_2").addClass('has-success has-feedback');
        $("#hor_pass_div_2").append('<span id="glyphicon_username" class="glyphicon glyphicon-ok form-control-feedback"></span>');

    }

    if(mes_json.password1.status == 'false' || mes_json.password2.status == 'false')
    {
        $("#password_div_1").addClass('has-error has-feedback');
        $("#password_div_2").addClass('has-error has-feedback');

        $("#hor_pass_div_1").append('<span id="glyphicon_username" class="glyphicon glyphicon-remove form-control-feedback"></span>');
        $("#hor_pass_div_2").append('<span id="glyphicon_username" class="glyphicon glyphicon-remove form-control-feedback"></span>');

        $("#hor_pas1_mg").append('<label class="help-block">'+mes_json.password1.message+'</label>');
        $("#hor_pas2_mg").append('<label class="help-block">'+mes_json.password2.message+'</label>');
    }

    }

    function add_twittolist(id, twit, date)
    {
        var new_twit = '';
        new_twit += '<div id="twit_'+id+'" class="blog-post">';
        new_twit += '<div class="row">';
        new_twit += '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">';
        new_twit += '<p type="date" class="blog-post-meta">'+date+'</p>';
        new_twit += '</div>';
        new_twit += '<div align="right" class="col-xs-6 col-sm-6 col-md-6 col-lg-6">';
        new_twit += '<div>';
        new_twit += '<a id="upd_'+id+'" name="upd_'+id+'" href="/twit/upd/'+id+'"><span class="glyphicon glyphicon-pencil"></span></a>';
        new_twit += '<a id="del_'+id+'" name="del_'+id+'" href="/twit/del/'+id+'"><span class="glyphicon glyphicon-remove"></span></a>';
        new_twit += '</div>';
        new_twit += '</div>';
        new_twit += '</div>';
        new_twit += '<h3 id="twi_text_'+id+'">'+twit+'</h3>';
        new_twit += '</div>';
        return new_twit
    }


    function upd_twitform(id_link)
    {
        var id = id_link.match( /upd_(\d+)/i )[1];
        last_twit = $('#twi_text_'+id).text();


        var new_form = ""
        new_form += '<input type="text" id="upd_twi_'+id+'" class="form-control form_post" value="'+last_twit+'">';
        new_form += '<button type="button" id="confirm_twit_edit" class="btn btn-default btn-sm form_margin_inl">Confirm changes</button>';
        new_form += '<button type="button" id="cansel_twit_edit" class="btn btn-default btn-sm form_margin_inl">Cancel</button>';

        //$("куда добавляем").append("что добавляем")
        $("#twit_"+id).append(new_form)
        return {"id": id, "edit_twit": last_twit}
    }

    function twit_form_back(id, text_twit)
    {
        $("#upd_"+id).show();
        $("#del_"+id).show();
        $("#twi_text_"+id).show();
        $("#twi_text_"+id).text(text_twit);

        $("#upd_twi_"+id).remove();
        $("#confirm_twit_edit").remove();
        $("#cansel_twit_edit").remove();

        upd_twit_id = null;
        upd_twit_text = null;
    }




    function getCookie(name) 
    {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');
    function csrfSafeMethod(method) 
    {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    function sameOrigin(url) 
    {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
          
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
    });

}
}