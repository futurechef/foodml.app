'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { VerificationCreate } from '@/lib/types';
import { Star, Loader2, CheckCircle } from 'lucide-react';

interface VerificationFormProps {
  recipeId: number;
  onVerificationSubmitted?: () => void;
}

export default function VerificationForm({
  recipeId,
  onVerificationSubmitted,
}: VerificationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<VerificationCreate>({
    defaultValues: {
      recipe_id: recipeId,
      rating: 0,
      success: true,
    },
  });

  const onSubmit = async (data: VerificationCreate) => {
    if (selectedRating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.createVerification({
        ...data,
        recipe_id: recipeId,
        rating: selectedRating,
      });

      setSubmitted(true);
      reset();
      setSelectedRating(0);

      if (onVerificationSubmitted) {
        onVerificationSubmitted();
      }

      // Reset submitted state after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="card bg-green-50 border-green-200">
        <div className="flex items-center justify-center space-x-2 text-green-700">
          <CheckCircle className="w-6 h-6" />
          <p className="font-semibold">Thank you for your feedback!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">Have you tried this recipe?</h3>
      <p className="text-gray-600 mb-6">
        Share your experience to help others make this recipe successfully!
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How would you rate this recipe?
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setSelectedRating(rating)}
                onMouseEnter={() => setHoveredRating(rating)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    rating <= (hoveredRating || selectedRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {selectedRating > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {selectedRating === 1 && 'Poor'}
              {selectedRating === 2 && 'Fair'}
              {selectedRating === 3 && 'Good'}
              {selectedRating === 4 && 'Very Good'}
              {selectedRating === 5 && 'Excellent'}
            </p>
          )}
        </div>

        {/* Success Toggle */}
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register('success')}
              defaultChecked
              className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">
              The recipe worked well for me
            </span>
          </label>
        </div>

        {/* Execution Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How long did it actually take? (minutes)
          </label>
          <input
            type="number"
            {...register('execution_time_minutes', { min: 0 })}
            className="input"
            placeholder="Optional"
            disabled={isSubmitting}
          />
        </div>

        {/* Feedback Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Feedback (Optional)
          </label>
          <textarea
            {...register('feedback_text')}
            className="input min-h-[100px]"
            placeholder="Share your experience, any modifications you made, or tips for others..."
            disabled={isSubmitting}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn btn-primary flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <span>Submit Review</span>
          )}
        </button>
      </form>
    </div>
  );
}
