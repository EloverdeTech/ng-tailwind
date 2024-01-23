export abstract class NgtAbilityValidationService {
    public abstract hasManagePermission(): Promise<boolean>;

    public abstract isSectionHidden(section: string): Promise<boolean>;

    public abstract isSectionEnabled(section: string): Promise<boolean>;
}
