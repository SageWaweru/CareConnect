# Generated by Django 5.1.5 on 2025-01-28 08:59

import cloudinary.models
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('care_app', '0006_caretakerprofile_number_of_ratings_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='caretakerprofile',
            name='ratings',
        ),
        migrations.AddField(
            model_name='caretakerprofile',
            name='average_rating',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=3),
        ),
        migrations.AddField(
            model_name='caretakerprofile',
            name='profile_picture',
            field=cloudinary.models.CloudinaryField(blank=True, max_length=255, null=True, verbose_name='image'),
        ),
        migrations.AddField(
            model_name='caretakerprofile',
            name='rate',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
        migrations.AddField(
            model_name='caretakerprofile',
            name='rate_type',
            field=models.CharField(choices=[('hour', 'Hour'), ('day', 'Day'), ('week', 'Week')], default='hour', max_length=10),
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.IntegerField(choices=[(1, '1 Star'), (2, '2 Stars'), (3, '3 Stars'), (4, '4 Stars'), (5, '5 Stars')])),
                ('review_text', models.TextField()),
                ('caretaker_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='care_app.caretakerprofile')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('caretaker_profile', 'user')},
            },
        ),
    ]
