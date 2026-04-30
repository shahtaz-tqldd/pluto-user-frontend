import React, { useMemo } from "react";
import {
  CalendarDays,
  HeartHandshake,
  MessageSquareText,
  PawPrint,
  Star,
  UserRound,
} from "lucide-react";
import { useReviewListQuery } from "@/features/reviews/reviewApiSlice";
import { fallbackValue, getInitials } from "@/lib/utils";

const mockReviews = [
  {
    id: "review-01",
    adoption: {
      id: "adoption-01",
      completed_at: "2026-04-21T10:30:00.000Z",
    },
    pet: {
      id: "pet-01",
      name: "Milo",
      type: "Dog",
      breed: "Indie",
      image: "",
    },
    reviewer: {
      id: "user-nadia",
      name: "Nadia Rahman",
      role: "RESCUER",
      avatar: "",
    },
    reviewee: {
      id: "user-shahtaz",
      name: "Shahtaz Shanto",
      role: "ADOPTER",
      avatar: "",
    },
    direction: "RESCUER_TO_ADOPTER",
    rating: 5,
    comment:
      "Shahtaz came prepared with home photos, asked thoughtful care questions, and sent helpful follow-up updates after Milo settled in.",
    created_at: "2026-04-25T08:15:00.000Z",
  },
  {
    id: "review-02",
    adoption: {
      id: "adoption-02",
      completed_at: "2026-04-12T16:00:00.000Z",
    },
    pet: {
      id: "pet-02",
      name: "Tuni",
      type: "Cat",
      breed: "Domestic Shorthair",
      image: "",
    },
    reviewer: {
      id: "user-shahtaz",
      name: "Shahtaz Shanto",
      role: "ADOPTER",
      avatar: "",
    },
    reviewee: {
      id: "user-tahsin",
      name: "Tahsin Alam",
      role: "RESCUER",
      avatar: "",
    },
    direction: "ADOPTER_TO_RESCUER",
    rating: 4.8,
    comment:
      "Tahsin shared Tuni's treatment notes, food routine, and vaccination details before handover. The process felt careful and transparent.",
    created_at: "2026-04-16T11:45:00.000Z",
  },
  {
    id: "review-03",
    adoption: {
      id: "adoption-03",
      completed_at: "2026-03-29T13:20:00.000Z",
    },
    pet: {
      id: "pet-03",
      name: "Bhulu",
      type: "Dog",
      breed: "Labrador Mix",
      image: "",
    },
    reviewer: {
      id: "user-sabrina",
      name: "Sabrina Jahan",
      role: "RESCUER",
      avatar: "",
    },
    reviewee: {
      id: "user-shahtaz",
      name: "Shahtaz Shanto",
      role: "ADOPTER",
      avatar: "",
    },
    direction: "RESCUER_TO_ADOPTER",
    rating: 4.7,
    comment:
      "Good communication through screening and pickup. The adopter followed the walking plan and kept the first-week check-in on time.",
    created_at: "2026-04-03T14:10:00.000Z",
  },
];

const getResponseReviews = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.results)) return response.results;
  return [];
};

const normalizeReview = (review) => ({
  id: review.id,
  adoption: {
    id: review.adoption?.id || review.adoption_id,
    completed_at:
      review.adoption?.completed_at ||
      review.adoption_completed_at ||
      review.completed_at,
  },
  pet: {
    id: review.pet?.id || review.pet_id,
    name: review.pet?.name || review.pet_name,
    type: review.pet?.type || review.pet_type,
    breed: review.pet?.breed || review.pet_breed,
    image: review.pet?.image || review.pet_image,
  },
  reviewer: {
    id: review.reviewer?.id || review.reviewer_id,
    name: review.reviewer?.name || review.reviewer_name,
    role: review.reviewer?.role || review.reviewer_role,
    avatar: review.reviewer?.avatar || review.reviewer_avatar,
  },
  reviewee: {
    id: review.reviewee?.id || review.reviewee_id,
    name: review.reviewee?.name || review.reviewee_name,
    role: review.reviewee?.role || review.reviewee_role,
    avatar: review.reviewee?.avatar || review.reviewee_avatar,
  },
  direction: review.direction,
  rating: Number(review.rating || 0),
  comment: review.comment || review.body || review.review || "",
  created_at: review.created_at,
});

const formatDate = (date) => {
  if (!date) return "Recent adoption";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Recent adoption";

  return parsedDate.toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const roleLabel = (role) => fallbackValue(role, "Member").toLowerCase();

const ReviewAvatar = ({ person }) => {
  const name = fallbackValue(person?.name, "Member");

  return (
    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-2xl bg-primary/8 text-primary">
      {person?.avatar ? (
        <img
          src={person.avatar}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm font-semibold">
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};

const PetReference = ({ pet, adoption }) => {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-2xl border border-primary/10 bg-white p-3">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/8 text-primary">
        {pet.image ? (
          <img
            src={pet.image}
            alt={pet.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <PawPrint className="size-5" />
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-900">
          {fallbackValue(pet.name, "Adopted pet")}
        </p>
        <p className="mt-1 truncate text-xs text-slate-500">
          {[pet.type, pet.breed].filter(Boolean).join(" • ") ||
            "Pet details pending"}
        </p>
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-400">
          <CalendarDays className="size-3.5" />
          Adopted {formatDate(adoption.completed_at)}
        </p>
      </div>
    </div>
  );
};

const ReviewCard = ({ review }) => {
  return (
    <article className="rounded-[24px] border border-primary/10 bg-[#f8fbf9] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <ReviewAvatar person={review.reviewer} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {fallbackValue(review.reviewer.name, "Reviewer")}
            </p>
            <p className="mt-1 text-xs capitalize text-slate-500">
              Reviewed by {roleLabel(review.reviewer.role)}
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-semibold text-primary">
          <Star className="size-3.5 fill-primary" />
          {review.rating ? review.rating.toFixed(1) : "New"}
        </span>
      </div>

      <PetReference pet={review.pet} adoption={review.adoption} />

      <div className="mt-4 rounded-2xl bg-white/80 p-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
          <MessageSquareText className="size-3.5" />
          Comment
        </div>
        <p className="text-sm leading-6 text-slate-600">
          {fallbackValue(review.comment, "No comment added yet.")}
        </p>
      </div>
    </article>
  );
};

const ProfileReviews = ({ profile }) => {
  const { data, isLoading } = useReviewListQuery();
  const apiReviews = getResponseReviews(data);

  const reviews = useMemo(() => {
    if (isLoading) return [];

    const source = apiReviews.length > 0 ? apiReviews : mockReviews;
    return source.map(normalizeReview);
  }, [apiReviews, isLoading]);

  return (
    <section className="overflow-hidden rounded-[30px] border border-primary/10 bg-white shadow-[0_16px_40px_rgba(2,24,19,0.05)]">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="mb-3 inline-flex rounded-2xl bg-primary/8 p-2 text-primary">
          <HeartHandshake className="size-4" />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Adoption reviews
            </h2>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-4">
        {isLoading ? (
          <div className="rounded-[24px] border border-primary/10 bg-[#f8fbf9] p-4 text-sm text-slate-500">
            Loading reviews...
          </div>
        ) : null}

        {reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <div className="rounded-[24px] border border-primary/10 bg-[#f8fbf9] p-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary">
              <UserRound className="size-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-900">
              No adoption reviews yet
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Reviews will appear after an adoption is completed and either side
              leaves feedback.
            </p>
          </div>
        )}
      </div>
      <div className="border-t border-slate-100 bg-[#f8fbf9] px-5 py-4">
        <p className="text-sm leading-6 text-slate-500">
          {fallbackValue(profile?.name, "This profile")} has received feedback
          from completed adoption handovers.
        </p>
      </div>
    </section>
  );
};

export default ProfileReviews;
