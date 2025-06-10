
from django.contrib import admin
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static
from home import views
from django.utils.translation import gettext_lazy as _


urlpatterns = [
    path('home/', include('home.urls')),
    path('', include('home.urls')),

    path('ckeditor/', include('ckeditor_uploader.urls')),
    path('admin/', admin.site.urls),
    path('jet/', include('jet.urls')),
    path('jet/dashboard/', include('jet.dashboard.urls', 'jet-dashboard')),
    path('company', views.company, name='company'),

    path('<slug:slug>', views.company_details, name='company_details'),
    path('colorcode/', views.COLORPICKER, name='colorcode'),
    path('qr-generator/', views.QR_GENERATOR, name='qr-generator'),
    path('about_us/',views.about_us, name='about_us'),
    path('calculator/', views.CALCULATOR, name='calculator'),
    path('expense_tracker/', views.EXPENSE_TRACKER, name='expense_tracker'),
    path('cv_maker/', views.WEATHER_TRACKER, name='cv_maker'),
    path('note_pad/', views.NOTE_PAD, name='note_pad'),
    path('typing_test/', views.TYPING_TEST, name='typing_test'),
    path('habbit_trackers/', views.HABBIT_TRACKER, name='habbit_tracker'),
    path('language_learning/', views.LANQUAGE, name='language_learning'),
    path('mini_paint/', views.MINI_PAINT, name='mini_paint'),
    path('calender/', views.Calender, name='calender'),
    path('aI-powered-drawing/', views.AI_DRAWING, name='aI-powered-drawing'),







   


    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
