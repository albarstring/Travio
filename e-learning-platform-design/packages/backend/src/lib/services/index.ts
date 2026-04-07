/**
 * Service Exports
 * Centralized import untuk semua services
 * 
 * Gunakan:
 * import { authService, courseService } from "@/lib/services"
 */

export { AuthService, authService } from "./AuthService"
export type { SessionData, LoginResponse } from "./AuthService"

export { CourseService, courseService } from "./CourseService"

export { SectionService, sectionService } from "./SectionService"

// Template untuk service baru:
// export { EntityService, entityService } from "./EntityService"
