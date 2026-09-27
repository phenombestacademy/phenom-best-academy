# Phenom Account Centre — Profile, Settings & Access Policy

## 1. Purpose

The Phenom Account Centre is the authenticated user's central place to manage their Phenom identity, personal profile, security, preferences and programme access.

The account centre must complement, not replace, the existing Phenom authentication flow.

## 2. Primary access routes

Users must have two supported routes to their account settings:

1. **Profile picture / avatar — primary route:** when signed in, the profile picture placeholder is displayed at the top-right of the Phenom website. Clicking it opens the account menu.
2. **MORE → Settings — secondary route:** the mobile MORE menu must contain a Settings entry that opens the same account centre.

The same underlying profile and settings data must be used by both routes. There must not be separate profile records or duplicate settings systems.

## 3. Signed-in profile avatar

When authenticated:

- Show the user's uploaded profile picture at the top-right.
- If no picture exists, show a clean initials/default avatar placeholder.
- Clicking the avatar opens the account menu.
- The account menu identifies the user and displays their Phenom User ID where available.
- The account menu provides access to My Profile, Settings, My Programmes and Sign out.
- Sign out must terminate only the active session; it must not delete the user's profile or account data.

When signed out, the existing Sign in / Sign up experience remains available.

## 4. Profile

Profile is the principal account-management section.

The user may manage permitted personal information including:

- Profile picture
- First name
- Middle name
- Surname
- Phone number
- Date of birth
- Gender, where appropriate
- Country
- State / region
- City
- Address
- Preferred Academy language

The system must retain the user's Phenom User ID as the stable account identifier. Ordinary users must not be given an unrestricted control to replace or impersonate another user's ID.

## 5. Profile picture

Profile pictures are user-owned profile assets.

Requirements:

- Image upload only; non-image files are rejected.
- Maximum upload size: 5 MB.
- The user may replace or remove their own picture.
- Storage access is restricted for writes to the authenticated owner.
- Public display is permitted for the profile avatar because the avatar is part of the user's visible Academy identity; no other private account information is exposed through the storage object.
- The profile record stores the resulting avatar URL.

## 6. Security and password changes

Settings must provide a dedicated Security section.

The authenticated password-change flow is:

**Change password → email OTP → verify 6-digit OTP → create new password → confirm new password → success.**

Password requirements:

- Minimum 8 characters.
- Password and confirmation must match.
- The interface must provide Show / Hide password control.
- Existing authentication, OTP and recovery behaviour must not be broken by the settings implementation.

The existing forgotten-password recovery flow remains available from the sign-in environment.

## 7. My Programmes

Settings must provide a **My Programmes** area.

It is the account-level starting point for:

- Viewing current programme access/subscriptions.
- Exploring eligible Academy programmes.
- Moving into the appropriate programme catalogue or service to enrol/subscribe.

Programme eligibility and payment rules remain controlled by the relevant programme service and subscription/payment architecture. Settings must not create duplicate payment records or bypass programme eligibility.

Examples of programme areas include learning catalogue services, CPD and language education, subject to the user's account type and eligibility.

## 8. Account-type awareness

Programme discovery must respect the user's Phenom account category/role, including student, teenager/youth, teacher, professional, parent/guardian, adult and school-related roles.

The settings interface must not silently grant a restricted entitlement merely because a programme is visible.

## 9. Preferences

Preferences may include Academy language and other account-level preferences. Existing site language controls and profile preferences should remain synchronised rather than creating competing settings.

## 10. MORE menu

The MORE menu remains a general Academy navigation area. It must include Settings as an account-management destination while retaining the existing Academy navigation items and access-point entry.

## 11. Security and data integrity

- All profile writes must use the authenticated user's Supabase session.
- Profile data must be written only to the current user's profile row through existing RLS policies.
- Avatar storage writes must be limited to the authenticated user's own storage folder.
- Authentication credentials and passwords must never be stored in the public profile table.
- The implementation must preserve existing Supabase authentication, RLS and programme/subscription architecture.
- The settings interface must not expose administrative or Super Admin controls to ordinary users.

## 12. Implementation rule

This Account Centre is an additive platform capability. Existing working authentication flows — Google sign-in, email OTP verification, password creation, password sign-in, forgotten-password recovery and session handling — must remain operational.

Any future changes to profile, settings, programmes or security must build on this policy rather than introducing a parallel account system.
