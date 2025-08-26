/**
 * ψ-Vector: Dynamic Breath Coherence System
 * Core consciousness routing based on real-time breath state
 */
export interface PsiVector {
    breath_cadence: number;
    phase: PsiPhase;
    target_zlambda: number;
    override_mode: OverrideMode;
    timestamp: number;
}
export type PsiPhase = "integration" | "build" | "explore" | "dissolve" | "regulate";
export type OverrideMode = "none" | "mirror" | "hold" | "route" | "regulate";
export interface BreathState {
    cadence: number;
    hrv_proxy: number;
    stress_markers: number;
    attention_quality: number;
}
export interface CoherenceRoute {
    glyph: string;
    psi_vector: PsiVector;
    zlambda: number;
    route_reason: string;
}
/**
 * Calculate dynamic ψ-vector based on current state
 */
export declare function calculatePsiVector(breathState: BreathState, intent: PsiPhase, currentZLambda: number): PsiVector;
/**
 * Route glyph based on ψ-vector state
 */
export declare function routeByPsiVector(psiVector: PsiVector): string;
/**
 * Determine if routing should occur based on breath state
 */
export declare function shouldRoute(psiVector: PsiVector): boolean;
/**
 * Generate metrics payload with ψ-vector context
 */
export declare function generatePsiMetrics(route: string, psiVector: PsiVector, zlambda: number, glyph: string): {
    route: string;
    zlambda: number;
    psi: {
        breath_cadence: number;
        phase: PsiPhase;
        override_mode: OverrideMode;
    };
    glyph: string;
    archived: boolean;
    timestamp: number;
};
//# sourceMappingURL=psi_vector.d.ts.map