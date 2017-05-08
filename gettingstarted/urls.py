from django.conf.urls import include, url

from django.contrib import admin
admin.autodiscover()

from hello import views

# Examples:
# url(r'^$', 'gettingstarted.views.home', name='home'),
# url(r'^blog/', include('blog.urls')),

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),

    url(r'^static/.*', views.static),
    url(r'^reg/', views.registration, name='registration'),
    url(r'^auth/', views.authentefication, name='authentefication'),
    url(r'^logout/', views.logout),
    url(r'^$', views.blog, name='blog'),

    url(r'^twit/', include('hello.urls')),    
    url(r'^regform/', views.regformlive),
    
]
