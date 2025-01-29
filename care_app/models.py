from django.db import models
from django.contrib.auth.models import AbstractUser
from .managers import CustomUserManager
from cloudinary.models import CloudinaryField
from django.db.models import Avg


class CustomUser(AbstractUser):
     ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('customer', 'Customer'),
        ('caretaker', 'Caretaker'),
        ('vocational_school', 'Vocational School'),
    ]

     role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
     objects = CustomUserManager()  
     
     def __str__(self):
        return f"{self.username} ({self.role})"
     


class CaretakerProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='caretaker_profile')
    name = models.CharField(max_length=255)
    certifications = models.TextField()  
    skills = models.CharField(max_length=255) 
    availability = models.CharField(max_length=255)  
    profile_picture = CloudinaryField('image', null=True, blank=True) 
    rate = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    rate_type = models.CharField(max_length=10, choices=[('hour', 'Hour'), ('day', 'Day'), ('week', 'Week')], default='hour')
    number_of_ratings = models.PositiveIntegerField(default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)

    def __str__(self):
        return self.name
    

    def update_average_rating(self):
            reviews = Review.objects.filter(caretaker_profile=self)
            total_rating = sum([review.rating for review in reviews])
            number_of_reviews = reviews.count()
            if number_of_reviews > 0:
                average = total_rating / number_of_reviews
                # Ensure the average is within the 1-5 star range
                self.average_rating = round(min(5, max(1, average)), 2)  # Clamp and round the average
            else:
                self.average_rating = 0
            self.save()    

class Review(models.Model):
    caretaker_profile = models.ForeignKey(CaretakerProfile, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(1, '1 Star'), (2, '2 Stars'), (3, '3 Stars'), (4, '4 Stars'), (5, '5 Stars')])
    review_text = models.TextField()
    
    class Meta:
        unique_together = ['caretaker_profile', 'user']

    def save(self, *args, **kwargs):
            is_new_review = not self.pk  # Check if this is a new review

            # Update the caretaker profile's rating if it's a new review
            super().save(*args, **kwargs)  # Save the review first
            if is_new_review:
                self.caretaker_profile.number_of_ratings += 1
            self.caretaker_profile.update_average_rating()  # Update the average rating after saving the review
            super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Update the caretaker profile's rating when deleting the review
        self.caretaker_profile.number_of_ratings -= 1
        self.caretaker_profile.update_average_rating()  # Recalculate the average rating
        super().delete(*args, **kwargs)

    def __str__(self):
        return f"Review for {self.caretaker_profile}: {self.rating} stars"


# Create your models here.
