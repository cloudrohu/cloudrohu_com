from django.shortcuts import render
from django.shortcuts import render,redirect
from utility.models import City


# Create your views here.

from business.models import City, Category,Company,CetegorySlider


def index(request):
    #category = categoryTree(0,'',currentlang)
    city = City.objects.all()
    category = Category.objects.all()
    cetegoryslider = CetegorySlider.objects.all()


    context={
        'category':category,
        'city':city,
        'cetegoryslider':cetegoryslider,
        
    }
    return render(request, 'index.html',context)


def company(request):

    city = City.objects.all()
    category = Category.objects.all()
    company = Company.objects.all()

    context={
        'category':category,
        'city':city,        
        'company':company,        
    }        
    return render(request, 'company.html', context)



def company_details(request,slug):
    
    company = Company.objects.filter(slug = slug)

    if company.exists():
        company = Company.objects.get(slug = slug)
    else:
        return redirect('404')    
    
    context = {
        'company': company,
    }   

    return render(request, 'company_details.html',context )




  #

def header(request):
    rs = City.objects.all() 
    return render(request, 'header.html', {'rs': rs})

def COLORPICKER(request):
    return render(request, 'moreservices/color_code.html')

def QR_GENERATOR(request):
    return render(request, 'moreservices/qr-generator.html')

def CALCULATOR(request):
    return render(request, 'moreservices/calculator.html')

def EXPENSE_TRACKER(request):
    return render(request, 'moreservices/expense_tracker.html')

def WEATHER_TRACKER(request):
    return render(request, 'moreservices/cv_maker.html')

def NOTE_PAD(request):
    return render(request, 'moreservices/mini_notes.html')

def TYPING_TEST(request):
    return render(request, 'moreservices/typing_test.html')

def HABBIT_TRACKER(request):
    return render(request, 'moreservices/habbit_tracker.html')

def LANQUAGE(request):
    return render(request, 'moreservices/language_learning.html')

def MINI_PAINT(request):
    return render(request, 'moreservices/mini_paint.html')

def Calender(request):
    return render(request, 'moreservices/calender.html')

def AI_DRAWING(request):
    return render(request, 'moreservices/ai-power-drawing.html')

def about_us(request):
    return render(request, 'main/about_us.html')    
