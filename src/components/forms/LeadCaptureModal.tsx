/**
 * Lead Capture Modal Component
 * Captures user email before PDF download
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Download, Loader2, Check, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { cn, isValidEmail } from '@/lib/utils';
import { COMPANY_INFO } from '@/lib/config';
import type { PropertyCheckResult } from '@/types';

const leadSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(2, 'Please enter your name').optional().or(z.literal('')),
  phone: z.string().optional(),
  marketingConsent: z.boolean(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeadFormData) => Promise<void>;
  propertyResult: PropertyCheckResult;
  isLoading?: boolean;
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  onSubmit,
  propertyResult,
  isLoading = false,
}: LeadCaptureModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      email: '',
      name: '',
      phone: '',
      marketingConsent: true,
    },
  });

  const handleFormSubmit = async (data: LeadFormData) => {
    setError(null);
    try {
      await onSubmit(data);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process your request. Please try again.');
    }
  };

  const handleClose = () => {
    reset();
    setSubmitted(false);
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:max-w-lg w-full bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#0F172A] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
                  <Download className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h2 className="text-white font-bold">Download Your Report</h2>
                  <p className="text-gray-400 text-sm">Free Heritage & Planning Analysis</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition p-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {submitted ? (
                // Success State
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Your Report is Ready!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Your personalized Heritage & Planning report is being downloaded.
                  </p>
                  <p className="text-sm text-gray-500">
                    We&apos;ve also sent a copy to your email for your records.
                  </p>
                  <button
                    onClick={handleClose}
                    className="btn-primary mt-6"
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                // Form State
                <>
                  {/* Property Summary */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Report for:</p>
                    <p className="font-medium text-gray-900">{propertyResult.address}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={cn(
                          'badge text-xs',
                          propertyResult.status === 'RED' && 'badge-red',
                          propertyResult.status === 'AMBER' && 'badge-amber',
                          propertyResult.status === 'GREEN' && 'badge-green'
                        )}
                      >
                        {propertyResult.status === 'RED'
                          ? 'Listed Building'
                          : propertyResult.status === 'AMBER'
                          ? 'Conservation Area'
                          : 'Standard Zone'}
                      </span>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="label">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          {...register('email')}
                          type="email"
                          id="email"
                          placeholder="your@email.com"
                          className={cn(
                            'input pl-10',
                            errors.email && 'input-error'
                          )}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="name" className="label">
                        Name (optional)
                      </label>
                      <input
                        {...register('name')}
                        type="text"
                        id="name"
                        placeholder="Your name"
                        className="input"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="label">
                        Phone (optional)
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        id="phone"
                        placeholder="07xxx xxxxxx"
                        className="input"
                      />
                    </div>

                    {/* Marketing Consent */}
                    <div className="flex items-start gap-3">
                      <input
                        {...register('marketingConsent')}
                        type="checkbox"
                        id="marketingConsent"
                        className="mt-1 w-4 h-4 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37]"
                      />
                      <label htmlFor="marketingConsent" className="text-sm text-gray-600">
                        I&apos;d like to receive occasional updates about planning tips and renovation
                        inspiration from {COMPANY_INFO.name}.
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Generating Report...
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Download Free Report
                        </>
                      )}
                    </button>
                  </form>

                  {/* Privacy Note */}
                  <p className="mt-4 text-xs text-gray-500 text-center">
                    We respect your privacy. Your information is secure and will never be shared.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
