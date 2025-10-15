import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalPrograms: number;
  activePrograms: number;
  totalEvents: number;
  upcomingEvents: number;
  completionRate: number;
  completedTasks: number;
  totalTasks: number;
  userGrowth: Array<{
    date: string;
    totalUsers: number;
    newUsers: number;
  }>;
}

export interface ProgramPerformance {
  name: string;
  status: string;
  startDate: Date | string;
  endDate: Date | string;
  enrollments: number;
  completions: number;
  completionRate: number;
  rating: string | number;
}

export interface UserEngagementMetrics {
  weeklyEngagement: number;
  monthlyEngagement: number;
  activeLastWeek: number;
  activeLastMonth: number;
  averageSessionDuration: number;
  totalSessions: number;
}

/**
 * Get analytics data for reports dashboard
 */
export const getAnalyticsData = async (): Promise<AnalyticsData> => {
  try {
    // Try to get aggregated analytics data first
    const analyticsRef = doc(db, "analytics", "dashboard");
    const analyticsSnap = await getDoc(analyticsRef);

    if (analyticsSnap.exists()) {
      const data = analyticsSnap.data();
      return {
        totalUsers: data.totalUsers ?? 0,
        activeUsers: data.activeUsers ?? 0,
        totalPrograms: data.totalPrograms ?? 0,
        activePrograms: data.activePrograms ?? 0,
        totalEvents: data.totalEvents ?? 0,
        upcomingEvents: data.upcomingEvents ?? 0,
        completionRate: data.completionRate ?? 0,
        completedTasks: data.completedTasks ?? 0,
        totalTasks: data.totalTasks ?? 0,
        userGrowth: data.userGrowth ?? [],
      };
    }

    // Fallback: Generate mock data for development
    const mockUserGrowth = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString(),
        totalUsers: 100 + i * 2 + Math.floor(Math.random() * 10),
        newUsers: Math.floor(Math.random() * 5) + 1,
      };
    });

    return {
      totalUsers: 245,
      activeUsers: 189,
      totalPrograms: 12,
      activePrograms: 8,
      totalEvents: 24,
      upcomingEvents: 6,
      completionRate: 78,
      completedTasks: 156,
      totalTasks: 200,
      userGrowth: mockUserGrowth,
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw new Error("Failed to fetch analytics data");
  }
};

/**
 * Get user engagement metrics
 */
export const getUserEngagementMetrics = async (): Promise<UserEngagementMetrics> => {
  try {
    // Try to get engagement metrics from Firebase
    const engagementRef = doc(db, "analytics", "engagement");
    const engagementSnap = await getDoc(engagementRef);

    if (engagementSnap.exists()) {
      const data = engagementSnap.data();
      return {
        weeklyEngagement: data.weeklyEngagement ?? 0,
        monthlyEngagement: data.monthlyEngagement ?? 0,
        activeLastWeek: data.activeLastWeek ?? 0,
        activeLastMonth: data.activeLastMonth ?? 0,
        averageSessionDuration: data.averageSessionDuration ?? 0,
        totalSessions: data.totalSessions ?? 0,
      };
    }

    // Fallback: Return mock engagement data
    return {
      weeklyEngagement: 72,
      monthlyEngagement: 85,
      activeLastWeek: 136,
      activeLastMonth: 208,
      averageSessionDuration: 24.5,
      totalSessions: 1247,
    };
  } catch (error) {
    console.error("Error fetching user engagement metrics:", error);
    throw new Error("Failed to fetch user engagement metrics");
  }
};

/**
 * Get program performance metrics
 */
export const getProgramPerformanceMetrics = async (): Promise<ProgramPerformance[]> => {
  try {
    // Try to get program performance data from Firebase
    const programsRef = collection(db, "programs");
    const programsQuery = query(programsRef, orderBy("createdAt", "desc"));
    const programsSnap = await getDocs(programsQuery);

    if (!programsSnap.empty) {
      return programsSnap.docs.map(doc => {
        const data = doc.data();
        return {
          name: data.name ?? "Unknown Program",
          status: data.status ?? "draft",
          startDate: data.startDate?.toDate() ?? new Date(),
          endDate: data.endDate?.toDate() ?? new Date(),
          enrollments: data.enrollments ?? 0,
          completions: data.completions ?? 0,
          completionRate: data.completionRate ?? 0,
          rating: data.rating ?? "0",
        };
      });
    }

    // Fallback: Return mock program performance data
    return [
      {
        name: "Youth Football Development",
        status: "active",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-06-15"),
        enrollments: 45,
        completions: 38,
        completionRate: 84.4,
        rating: "4.7",
      },
      {
        name: "Basketball Skills Training",
        status: "active",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-07-01"),
        enrollments: 32,
        completions: 28,
        completionRate: 87.5,
        rating: "4.5",
      },
      {
        name: "Athletic Conditioning Program",
        status: "upcoming",
        startDate: new Date("2024-11-01"),
        endDate: new Date("2025-04-01"),
        enrollments: 28,
        completions: 0,
        completionRate: 0,
        rating: "0",
      },
      {
        name: "Sports Leadership Workshop",
        status: "inactive",
        startDate: new Date("2023-09-01"),
        endDate: new Date("2023-12-01"),
        enrollments: 22,
        completions: 20,
        completionRate: 90.9,
        rating: "4.8",
      },
      {
        name: "Nutrition for Athletes",
        status: "draft",
        startDate: new Date("2024-12-01"),
        endDate: new Date("2025-03-01"),
        enrollments: 0,
        completions: 0,
        completionRate: 0,
        rating: "0",
      },
    ];
  } catch (error) {
    console.error("Error fetching program performance metrics:", error);
    throw new Error("Failed to fetch program performance metrics");
  }
};

/**
 * Generate sample analytics data for development/testing
 */
export const generateSampleAnalyticsData = async (): Promise<void> => {
  try {
    const analyticsRef = doc(db, "analytics", "dashboard");
    const engagementRef = doc(db, "analytics", "engagement");

    const mockUserGrowth = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString(),
        totalUsers: 100 + i * 2 + Math.floor(Math.random() * 10),
        newUsers: Math.floor(Math.random() * 5) + 1,
      };
    });

    const analyticsData = {
      totalUsers: 245,
      activeUsers: 189,
      totalPrograms: 12,
      activePrograms: 8,
      totalEvents: 24,
      upcomingEvents: 6,
      completionRate: 78,
      completedTasks: 156,
      totalTasks: 200,
      userGrowth: mockUserGrowth,
      lastUpdated: Timestamp.now(),
    };

    const engagementData = {
      weeklyEngagement: 72,
      monthlyEngagement: 85,
      activeLastWeek: 136,
      activeLastMonth: 208,
      averageSessionDuration: 24.5,
      totalSessions: 1247,
      lastUpdated: Timestamp.now(),
    };

    // Note: These would require admin privileges to write
    console.log("Sample analytics data generated (would need admin privileges to save)");
    console.log("Analytics:", analyticsData);
    console.log("Engagement:", engagementData);
  } catch (error) {
    console.error("Error generating sample analytics data:", error);
    throw new Error("Failed to generate sample analytics data");
  }
};
