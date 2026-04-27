import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BadgeCheck,
  BookHeart,
  ChevronRight,
  Clock3,
  HeartHandshake,
  MapPin,
  MessageCircleMore,
  PawPrint,
  ShieldCheck,
  Sparkles,
  Star,
  UserRoundPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CreatePetPostDialog from "@/features/pets/components/create-pet-post-dialog";
import {
  createSelfProfile,
  getProfileByUsername,
} from "./data/profile-data";

const getUserUsername = (user) => {
  if (user?.username) {
    return user.username;
  }

  const fallback = `${user?.first_name || ""}-${user?.last_name || ""}`
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  return fallback || "my-profile";
};

const ProfilePage = () => {
  const { username = "" } = useParams();
  const { user } = useSelector((state) => state.auth);
  const currentUsername = getUserUsername(user);
  const isSelfView = username === currentUsername;
  const profile =
    (isSelfView ? createSelfProfile(user, currentUsername) : null) ||
    getProfileByUsername(username) ||
    createSelfProfile(user, username || currentUsername);

  const isRescuer = profile.role === "rescuer";
  const showUploadButton = isSelfView && isRescuer;

  return (
    <div className="space-y-4 pb-8">
      <section className="overflow-hidden rounded-[30px] border border-primary/10 bg-white shadow-[0_16px_44px_rgba(2,24,19,0.06)]">
        <div className="bg-[linear-gradient(135deg,_rgba(244,251,247,0.98),_rgba(255,248,240,0.94))] p-4 sm:p-5">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[28px] border-4 border-white bg-[#eef8f2] shadow-[0_20px_40px_rgba(2,24,19,0.12)]">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    {isSelfView ? "Private view" : "Public view"}
                  </span>
                  <span className="rounded-full bg-primary/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    {isRescuer ? "Rescuer profile" : "Adopter profile"}
                  </span>
                </div>

                <div>
                  <h1 className="text-3xl font-semibold text-slate-900">
                    {profile.name}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-4 text-primary/60" />
                      {profile.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="size-4 text-primary/60" />
                      {profile.joinedLabel}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="size-4 text-primary/60" />
                      Trust score {profile.trustScore}
                    </span>
                  </div>
                </div>

                <p className="max-w-2xl text-sm leading-6 text-slate-600">
                  {profile.shortBio}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {isSelfView ? (
                <>
                  {showUploadButton ? (
                    <CreatePetPostDialog
                      title="Upload rescue post"
                      description="Add a new rescue listing with the care details adopters rely on before sending a request."
                      trigger={
                        <Button className="rounded-full px-4">
                          <PawPrint className="size-4" />
                          Upload pet
                        </Button>
                      }
                    />
                  ) : null}
                  <Button className="rounded-full px-4">
                    <UserRoundPen className="size-4" />
                    Edit profile
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full border-primary/15 bg-white/80 px-4 text-slate-700"
                  >
                    <Sparkles className="size-4 text-primary" />
                    Preview public trust card
                  </Button>
                </>
              ) : (
                <>
                  <Button className="rounded-full px-4">
                    <MessageCircleMore className="size-4" />
                    Message {isRescuer ? "rescuer" : "adopter"}
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full border-primary/15 bg-white/80 px-4 text-slate-700"
                  >
                    <HeartHandshake className="size-4 text-primary" />
                    Leave feedback
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {profile.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[24px] border border-white/80 bg-white/85 px-4 py-4 shadow-[0_10px_24px_rgba(2,24,19,0.05)]"
              >
                <p className="text-2xl font-semibold text-slate-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_360px]">
        <div className="space-y-4">
          {isRescuer ? (
            <>
              <ProfileSection
                icon={<PawPrint className="size-4" />}
                title="Current available pets"
                description="Animals currently open for adoption review from this rescuer."
              >
                <div className="grid gap-4 lg:grid-cols-2">
                  {profile.availablePets.map((pet) => (
                    <PetPreviewCard key={pet.id} pet={pet} />
                  ))}
                </div>
              </ProfileSection>

              <ProfileSection
                icon={<BookHeart className="size-4" />}
                title="Rescue history"
                description="Completed handovers and rescue outcomes visible to adopters."
              >
                <div className="grid gap-3">
                  {profile.adoptedHistory.map((entry) => (
                    <TimelineCard
                      key={entry.id}
                      title={entry.petName}
                      meta={`${entry.adoptedAt} • ${entry.adopter}`}
                      detail={entry.note}
                    />
                  ))}
                </div>
              </ProfileSection>
            </>
          ) : (
            <>
              <ProfileSection
                icon={<HeartHandshake className="size-4" />}
                title="Adoption history"
                description="Visible adoption background so rescuers can assess long-term responsibility."
              >
                <div className="grid gap-3">
                  {profile.adoptionHistory.map((entry) => (
                    <TimelineCard
                      key={entry.id}
                      title={entry.petName}
                      meta={`${entry.adoptedAt} • ${entry.rescuer}`}
                      detail={entry.note}
                    />
                  ))}
                </div>
              </ProfileSection>

              <ProfileSection
                icon={<Sparkles className="size-4" />}
                title="Recent activity"
                description="Signals that help rescuers understand communication and care consistency."
              >
                <div className="grid gap-3">
                  {profile.activityMoments.map((entry) => (
                    <TimelineCard
                      key={entry.id}
                      title={entry.title}
                      meta={entry.meta}
                      detail={entry.detail}
                    />
                  ))}
                </div>
              </ProfileSection>
            </>
          )}

          <ProfileSection
            icon={<Star className="size-4" />}
            title={isRescuer ? "Community reviews" : "Rescuer feedback"}
            description={
              isRescuer
                ? "Trust indicators from adopters and volunteers."
                : "Public comments from rescuers after adoption review or handover."
            }
          >
            <div className="grid gap-3">
              {profile.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </ProfileSection>
        </div>

        <div className="space-y-4">
          <ProfileSection
            icon={<BadgeCheck className="size-4" />}
            title={isSelfView ? "Private dashboard" : "Trust indicators"}
            description={
              isSelfView
                ? "Signals visible only to the account owner."
                : "Quick context for evaluating this profile before starting an adoption conversation."
            }
          >
            <div className="space-y-3">
              {profile.privateHighlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[22px] border border-primary/10 bg-[#f8fbf9] p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-sm font-medium text-slate-600">
                      {item.label}
                    </p>
                    <p className="text-lg font-semibold text-slate-900">
                      {item.value}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {item.note}
                  </p>
                </div>
              ))}
            </div>
          </ProfileSection>

          <ProfileSection
            icon={<ShieldCheck className="size-4" />}
            title="Trust checklist"
            description="Structured signals that support adoption confidence."
          >
            <div className="space-y-3">
              {profile.trustSignals.map((signal) => (
                <div
                  key={signal}
                  className="flex items-start gap-3 rounded-[22px] border border-primary/10 bg-white p-4"
                >
                  <div className="rounded-full bg-primary/8 p-2 text-primary">
                    <ShieldCheck className="size-4" />
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{signal}</p>
                </div>
              ))}
            </div>
          </ProfileSection>

          {isRescuer ? (
            <ProfileSection
              icon={<PawPrint className="size-4" />}
              title="Rescued pet list"
              description="Snapshot of recent rescue cases managed by this profile."
            >
              <div className="space-y-3">
                {profile.rescuedPets.map((pet) => (
                  <Link
                    key={pet.id}
                    to="/"
                    className="flex items-center gap-3 rounded-[22px] border border-primary/10 bg-white p-3 transition hover:bg-[#f8fbf9]"
                  >
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="h-16 w-16 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {pet.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {pet.petType} • {pet.location}
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-slate-400" />
                  </Link>
                ))}
              </div>
            </ProfileSection>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const ProfileSection = ({ icon, title, description, children }) => {
  return (
    <section className="overflow-hidden rounded-[30px] border border-primary/10 bg-white shadow-[0_16px_40px_rgba(2,24,19,0.05)]">
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="mb-2 inline-flex rounded-2xl bg-primary/8 p-2 text-primary">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
};

const PetPreviewCard = ({ pet }) => {
  return (
    <article className="overflow-hidden rounded-[24px] border border-primary/10 bg-[#f8fbf9]">
      <img src={pet.image} alt={pet.name} className="h-48 w-full object-cover" />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{pet.name}</h3>
            <p className="text-sm text-slate-500">{pet.label}</p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            {pet.status}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-white px-3 py-1">{pet.petType}</span>
          <span className="rounded-full bg-white px-3 py-1">{pet.breed}</span>
          <span className="rounded-full bg-white px-3 py-1">{pet.location}</span>
        </div>
      </div>
    </article>
  );
};

const TimelineCard = ({ title, meta, detail }) => {
  return (
    <div className="rounded-[24px] border border-primary/10 bg-[#f8fbf9] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
            {meta}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{detail}</p>
    </div>
  );
};

const ReviewCard = ({ review }) => {
  return (
    <article className="rounded-[24px] border border-primary/10 bg-[#f8fbf9] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{review.author}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
            {review.role}
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-primary">
          {review.rating}
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-900">
        {review.summary}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{review.body}</p>
    </article>
  );
};

export default ProfilePage;
