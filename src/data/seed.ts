import { faker } from '@faker-js/faker';

import type { Task, TaskStatus, TaskPriority } from '../types';

import { ASSIGNEES, STATUSES, PRIORITIES } from '../utils/constants';

const generateDueDate = (index: number): string | null => {
  if (index === 0) {
    return faker.date
      .between({
        from: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        to: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      })
      .toISOString()
      .split('T')[0];
  }

  if (index === 1) {
    return new Date().toISOString().split('T')[0];
  }

  if (index === 2) {
    return faker.date
      .between({
        from: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        to: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      })
      .toISOString()
      .split('T')[0];
  }

  if (Math.random() < 0.15) {
    return null;
  }

  return faker.date
    .future({ years: 1 })
    .toISOString()
    .split('T')[0];
};

const generateTasks = (count: number): Task[] => {
  const tasks: Task[] = [];

  for (let i = 0; i < count; i++) {
    const assignee =
      Math.random() < 0.2
        ? null
        : faker.helpers.arrayElement(ASSIGNEES);

    const title =
      Math.random() < 0.1
        ? faker.lorem.sentence({ min: 20, max: 30 })
        : faker.lorem.sentence({ min: 5, max: 15 });

    const status: TaskStatus = faker.helpers.arrayElement(STATUSES);

    const priority: TaskPriority = faker.helpers.arrayElement(PRIORITIES);

    tasks.push({
      id: faker.string.uuid(),

      title,

      description:
        Math.random() < 0.15
          ? null
          : faker.lorem.paragraph(),

      assignee,

      dueDate: generateDueDate(i),

      status,

      priority,

      createdAt: faker.date.past().toISOString(),

      updatedAt: faker.date.recent().toISOString(),
    });
  }

  tasks[0].title =
    'This is an extremely long task title that exceeds one hundred characters in length just to test the layout and truncation behavior of the UI components.';

  const longAssigneeIndex = tasks.findIndex(
    (task) => task.assignee === 'Christopher Jonathan Montgomery'
  );

  if (longAssigneeIndex === -1) {
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