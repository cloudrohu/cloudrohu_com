# Generated by Django 5.0.1 on 2025-05-30 08:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('business', '0012_company_sub_locality'),
    ]

    operations = [
        migrations.CreateModel(
            name='CetegorySlider',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('title2', models.CharField(max_length=50)),
                ('slug', models.SlugField(blank=True, null=True, unique=True)),
            ],
        ),
    ]
