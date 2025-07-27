import { homeSkeletonStyles } from './homeSkeletonStyles';

const HomeSkeleton = () => {
  return (
    <div class="home-skeleton animate-pulse">
      <style>{homeSkeletonStyles}</style>
      <div class="skeleton-title animate-pulse" />
      <div class="skeleton-container">
        <div class="skeleton-item animate-pulse" />
        <div class="skeleton-item animate-pulse" />
        <div class="skeleton-item animate-pulse" />
      </div>
      <div class="skeleton-buttons">
        <div class="skeleton-button animate-pulse" />
        <div class="skeleton-button animate-pulse" />
      </div>
    </div>
  );
};

export default HomeSkeleton;