<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;

class ProfileService
{
    public function __construct(
        protected StorageService $storageService
    ) {}

    /**
     * Get the authenticated user's profile data.
     */
    public function getProfile(User $user): array
    {
        $currentTeamId = getPermissionsTeamId();

        // 1. Fetch global roles & permissions (where team_id is null)
        setPermissionsTeamId(null);
        $user->unsetRelation('roles')->unsetRelation('permissions');
        $globalRoles = $user->roles()->get();
        $globalPermissions = $user->getAllPermissions();

        // 2. Fetch team-specific roles & permissions if a team is active
        $teamRoles = collect();
        $teamPermissions = collect();
        if ($currentTeamId !== null) {
            setPermissionsTeamId($currentTeamId);
            $user->unsetRelation('roles')->unsetRelation('permissions');
            $teamRoles = $user->roles()->get();
            $teamPermissions = $user->getAllPermissions();
        }

        // Restore team ID
        setPermissionsTeamId($currentTeamId);

        // Merge roles and permissions
        $allRoles = $globalRoles->concat($teamRoles)->unique('id');
        $allPermissions = $globalPermissions->concat($teamPermissions)->pluck('name')->unique()->values();

        // If user has Superadmin role, assign all system permissions
        if ($allRoles->contains(fn($r) => strtolower($r->name) === 'superadmin')) {
            $allPermissions = \Spatie\Permission\Models\Permission::pluck('name')->unique()->values();
        }

        return [
            'id'          => $user->id,
            'name'        => $user->name,
            'email'       => $user->email,
            'phone'       => $user->phone,
            'avatar'      => $user->avatar, // The User model now handles the URL conversion
            'status'      => $user->status ?? 'active',
            'roles'       => $allRoles->map(fn($r) => ['id' => $r->id, 'name' => $r->name])->values(),
            'permissions' => $allPermissions,
            'created_at'  => $user->created_at,
        ];
    }

    /**
     * Update the user's basic profile fields.
     */
    public function updateProfile(User $user, array $data): User
    {
        $user->update(array_filter([
            'name'  => $data['name']  ?? null,
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
        ], fn($v) => $v !== null));

        return $user->fresh()->load('roles');
    }

    /**
     * Upload avatar to R2 and update the user record.
     */
    public function uploadAvatar(User $user, UploadedFile $file): string
    {
        $result = $this->storageService->uploadFile(
            $file,
            'avatars',
            $user->getRawOriginal('avatar') // delete old avatar if exists
        );

        $user->avatar = $result['path'];
        $user->save();

        return $result['url'];
    }

    /**
     * Remove avatar from R2 and clear the user record.
     */
    public function removeAvatar(User $user): void
    {
        if ($user->getRawOriginal('avatar')) {
            $this->storageService->deleteFile($user->getRawOriginal('avatar'));
        }

        $user->avatar = null;
        $user->save();
    }

    /**
     * Change the user's password after verifying the current one.
     *
     * @return bool True if password was changed, false if current password is wrong
     */
    public function changePassword(User $user, string $currentPassword, string $newPassword): bool
    {
        if (!Hash::check($currentPassword, $user->password)) {
            return false;
        }

        $user->password = Hash::make($newPassword);
        $user->save();

        return true;
    }
}
