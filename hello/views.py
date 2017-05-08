from django.shortcuts import render
from django.template.loader import get_template
from django.template import Context
from django.shortcuts import redirect
from django.contrib import auth
from . import twitter_db
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.forms import UserCreationForm
import re
from django.views.static import serve
import os
import os.path
import mimetypes
from django.http import HttpResponse
import json
from django.template import RequestContext, Template
from django.template.loader import render_to_string, get_template
from django.core.urlresolvers import reverse


def main(request):
    return return_lalka(message='Blog Page')


def static(request):
    base = os.path.basename(request.path)
    file_path = request.path.replace("static", "assets")
    file_path = os.path.abspath(file_path[1:])
    with open(file_path, 'rb') as fp:
        file = fp.read()
    response = HttpResponse(
        file, content_type=mimetypes.guess_type(request.path)[0])
    response['Content-Disposition'] = 'attachment; filename="' + base + '"'
    return response


def update_twit(request):
    if request.user.is_authenticated():
        if request.method == "POST":
            twitter_db.update_data(
                twi_id=str(request.POST['upd_id']),
                new_twit=request.POST['text_twit'])

            twi_data = {"status": "ok"}
            return return_lalka(message=json.dumps(twi_data))

    return authentefication(request)


def delete_twit(request):
    twit_id = re.search("/twit/del/(\d+)", request.path).group(1)
    if request.user.is_authenticated():
        this_twit = twitter_db.delete_data_from_sql(
            user=request.user,
            row_id=twit_id
        )
        return return_lalka(message=json.dumps({"del_twit": "#twit_" + twit_id}))

    return authentefication(request)


def add_twit(request):
    view = "add_twit"
    if request.user.is_authenticated():
        if request.method == "POST":
            this_twit = twitter_db.add_data_to_sql(
                user=request.user,
                twit=request.POST["new_twit_text"])

            twit_dict = {
                "date": this_twit.twitter_date.strftime("%Y-%B-%d %H:%M:%S"),
                "twit": str(this_twit.twitter_text),
                "id": str(this_twit.id)
            }
            return return_lalka(json.dumps(twit_dict))
    return authentefication(request)


def blog(request):
    if request.user.is_authenticated():
        request.session.set_expiry(1000)
        view = "blog"
        dick = {
            'twit_update': None,
            'delete_twit': '/twit/del/',
            'update_form': '/twit/upd/',
            'send_link': '/twit/add/',
            'logout': '/logout/',
            'username': request.user,
            'articles': twitter_db.read_data_from_sql(request.user)
        }
        blog_body = render_to_string(
            'blog_ajax.html', context=dick, request=request)
        if request.method == "GET":
            dick['BODY'] = blog_body
            return render(request, 'twitter_ajax.html', dick)

        return moses_response(where="body",
                              what=blog_body,
                              request=request,
                              )
    return authentefication(request)


def registration(request):
    view = "registration"
    mes_dick = {}
    dick = {"reg_form_link": request.path_info}
    if request.method == "POST":
        if "username" in request.POST:
            newuser_form = UserCreationForm(request.POST)
            if newuser_form.is_valid():
                newuser_form.save()
                newuser = auth.authenticate(
                    username=newuser_form.cleaned_data['username'],
                    password=newuser_form.cleaned_data['password2']
                )
                auth.login(request, newuser)
                request.session.set_expiry(1000)
                request.session["twit"] = True
                return blog(request)
            else:
                return HttpResponse(regformlivemessage(newuser_form, request.POST, mes_dick), content_type='application/json')

    if request.method == "GET":
        dick['error'] = False
    return render(request, 'reg_ajax.html', dick)


def authentefication(request):
    dick = {
        "auth_form_link": reverse('authentefication'),
        "reg_page": '/reg/'}

    if request.method == "POST":
        username = request.POST.get("enter_username", '')
        password = request.POST.get("password", '')
        user = auth.authenticate(
            username=username,
            password=password
        )

        if user is not None:
            auth.login(request, user)
            request.session.set_expiry(1000)
            request.session["twit"] = True
            return blog(request)

        if user is None:
            return return_lalka(message="UNCORECT_USER")

    dick['username'] = "tmp_user"
    dick['BODY'] = render_to_string(
        'auth_ajax.html', context=dick, request=request)
    return render(request, 'twitter_ajax.html', dick)


def logout(request):
    auth.logout(request)
    dick = {
        "auth_form_link": reverse('authentefication'),
        "reg_page": reverse('registration')}
    return moses_response(where="body",
                          what=render_to_string(
                              'auth_ajax.html', context=dick, request=request),
                          request=request,
                          )


def moses_response(where, what, request, dict_template={}):
    dick = {'what': what, 'where': where}
    c = RequestContext(request, dict_template)
    t = Template(json.dumps(dick))
    response = HttpResponse(t.render(c), content_type='text/html')
    return response


def regformlive(request):
    dick = {"reg_form_link": request.path_info}
    mes_dick = {}
    mes_dick['username'] = {"status": "ok", "message": "ok"}
    mes_dick['password1'] = {"status": "ok", "message": "ok"}
    mes_dick['password2'] = {"status": "ok", "message": "ok"}

    if request.method == "POST":
        if "username" in request.POST:
            newuser_form = UserCreationForm(request.POST)
            if newuser_form.is_valid():
                return HttpResponse(regformlivemessage(newuser_form, request.POST, mes_dick), content_type='application/json')

            else:
                return HttpResponse(regformlivemessage(newuser_form, request.POST, mes_dick), content_type='application/json')

    return render(request, 'reg_ajax.html', dick)


def regformlivemessage(dj_form, post, dick):

    user_mg = re.search(
        '<label for="id_username">Username:</label></th><td>(.*)<input id="id_username"', str(dj_form)).group(1)
    print("USER MG >>>", user_mg.encode())
    if user_mg != '':
        user_mg = re.search('<li>(.*)</li>', user_mg).group(1)
        dick['username']['status'] = 'false'
        dick['username']['message'] = user_mg

    else:
        dick['username']['status'] = 'ok'
        dick['username']['message'] = 'ok'

    pas1_mg = re.findall(
        '<label for="id_password1">Password:</label></th><td>(.*)<input id="id_password1"', str(dj_form))

    pas2_mg = re.findall(
        '<label for="id_password2">Password confirmation:</label></th><td>(.*)<input id="id_password2"', str(dj_form))

    if pas1_mg != [''] or pas2_mg != ['']:
        dick['password1']['status'] = 'false'
        dick['password1']['message'] = " ".join(pas1_mg)
        dick['password2']['status'] = 'false'
        dick['password2']['message'] = " ".join(pas2_mg)

    else:
        dick['password1']['status'] = 'ok'
        dick['password1']['message'] = 'ok'
        dick['password2']['status'] = 'ok'
        dick['password2']['message'] = 'ok'

    return json.dumps(dick)


def return_lalka(message='LALKA'):
    response = HttpResponse(
        message,
        content_type='text/plain'
    )
    return response
