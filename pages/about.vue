<template>
  <div class="about-page">
    <!-- First section: Hero with background image -->
    <AboutHeroSection
      title="about.hero.title"
      subtitle="about.hero.subtitle"
      cta="about.hero.cta"
      backgroundImage="/images/about/hero.jpg"
    />
    
    <!-- Second section: Dark background -->
    <AgencyOverview />
    
    <!-- Third section: Light background -->
    <AboutMissionSection />
    
    <!-- Fourth section: Dark background -->
    <CoreValuesGrid />
    
    <!-- Fifth section: Light background -->
    <!-- <HistoryTimeline /> -->
  </div>
</template>
<script setup lang="ts">
import AboutHeroSection from '~/components/ui/about/AboutHeroSection.vue';
import AgencyOverview from '~/components/ui/about/AgencyOverview.vue';
import AboutMissionSection from '~/components/ui/about/AboutMissionSection.vue';
import CoreValuesGrid from '~/components/ui/about/CoreValuesGrid.vue';
// import HistoryTimeline from '~/components/ui/about/HistoryTimeline.vue';

useHead({
  title: 'About - Wonder Land',
  meta: [
    { name: 'description', content: 'Learn about Wonder Land Travel & Tourism agency, your gateway to unforgettable travel experiences.' }
  ]
})
</script>