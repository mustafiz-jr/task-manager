import { faker } from '@faker-js/faker';
import type { Task, TaskStatus, TaskPriority } from '../types';
import { ASSIGNEES, STATUSES, PRIORITIES } from '../utils/constants';

const generateTasks = (count: number): Task[] => {
  const tasks: Task[] = [];
  for (let i = 0; i < count; i++) {
    const assignee = Math.random() < 0.2 ? null : faker.helpers.arrayElement(ASSIGNEES);
    const dueDate = Math.random() < 0.15 ? null : faker.date.future({ years: 1 }).toISOString().split('T')[0];
    const title = Math.random() < 0.1
      ? faker.lorem.sentence({ min: 20, max: 30 })
      : faker.lorem.sentence({ min: 5, max: 15 });
    const status = faker.helpers.arrayElement(STATUSES);
    const priority = faker.helpers.arrayElement(PRIORITIES);
    tasks.push({
      id: faker.string.uuid(),
      title: title.length > 100 ? title : title, 
      description: Math.random() < 0.15 ? null : faker.lorem.paragraph(),
      assignee,
      dueDate,
      status,
      priority,
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    });
  }

  tasks[0].title = 'This is an extremely long task title that exceeds one hundred characters in length just to test the layout and truncation behavior of the UI components.';
  
  const idx = tasks.findIndex(t => t.assignee === 'Christopher Jonathan Montgomery');
  if (idx === -1) {
    tasks[0].assignee = 'Christopher Jonathan Montgomery';
  }
  return tasks;
};


export const fetchTasks = (): Promise<Task[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.05) {
        reject(new Error('Failed to fetch tasks. Please retry.'));
      } else {
        resolve(generateTasks(600));
      }
    }, 800);
  });
};