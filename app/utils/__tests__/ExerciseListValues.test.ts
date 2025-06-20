import { exercises } from '../ExerciseListValues';

describe('ExerciseListValues', () => {
  it('should contain all expected exercises', () => {
    expect(exercises).toBeDefined();
    expect(Array.isArray(exercises)).toBe(true);
    expect(exercises.length).toBeGreaterThan(0);
  });

  it('should have exercises with required properties', () => {
    exercises.forEach((exercise) => {
      expect(exercise).toHaveProperty('title');
      expect(exercise).toHaveProperty('category');
      expect(exercise).toHaveProperty('image');
      expect(exercise).toHaveProperty('targetScreen');
      
      // Check that properties are strings
      expect(typeof exercise.title).toBe('string');
      expect(typeof exercise.category).toBe('string');
      expect(typeof exercise.image).toBe('string');
      expect(typeof exercise.targetScreen).toBe('string');
      
      // Check that required properties are not empty
      expect(exercise.title.length).toBeGreaterThan(0);
      expect(exercise.category.length).toBeGreaterThan(0);
      expect(exercise.targetScreen.length).toBeGreaterThan(0);
    });
  });

  it('should have unique exercise titles', () => {
    const titles = exercises.map(exercise => exercise.title);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
  });

  it('should have valid route formats', () => {
    exercises.forEach((exercise) => {
      // Routes should start with a forward slash
      expect(exercise.targetScreen).toMatch(/^\//);
    });
  });

  it('should contain expected exercise types', () => {
    const exerciseTitles = exercises.map(exercise => exercise.title.toLowerCase());
    
    // Check for expected breathing exercises
    expect(exerciseTitles.some(title => title.includes('breathing'))).toBe(true);
    expect(exerciseTitles.some(title => title.includes('box'))).toBe(true);
    
    // Check for expected sensory exercises
    expect(exerciseTitles.some(title => title.includes('5-4-3-2-1'))).toBe(true);
    expect(exerciseTitles.some(title => title.includes('color'))).toBe(true);
    expect(exerciseTitles.some(title => title.includes('sound'))).toBe(true);
  });
}); 