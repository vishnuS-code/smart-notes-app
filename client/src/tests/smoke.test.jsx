import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NoteCard from '../components/NoteCard';

/**
 * Smoke tests for the frontend components.
 * Tests pure UI components that have no router or API dependencies.
 */

const mockNote = {
  id: 'test-id-1',
  title: 'Test Note Title',
  content: 'This is the test note content.',
  createdAt: new Date('2024-01-15').toISOString(),
};

describe('NoteCard', () => {
  it('renders the note title', () => {
    render(
      <NoteCard
        note={mockNote}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText('Test Note Title')).toBeInTheDocument();
  });

  it('renders the note content', () => {
    render(
      <NoteCard
        note={mockNote}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText('This is the test note content.')).toBeInTheDocument();
  });

  it('renders Edit and Delete buttons', () => {
    render(
      <NoteCard
        note={mockNote}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls onEdit with the note when Edit is clicked', async () => {
    const onEdit = vi.fn();
    const { getByText } = render(
      <NoteCard note={mockNote} onEdit={onEdit} onDelete={() => {}} />
    );
    getByText('Edit').click();
    expect(onEdit).toHaveBeenCalledWith(mockNote);
  });

  it('calls onDelete with the note id when Delete is clicked', () => {
    const onDelete = vi.fn();
    const { getByText } = render(
      <NoteCard note={mockNote} onEdit={() => {}} onDelete={onDelete} />
    );
    getByText('Delete').click();
    expect(onDelete).toHaveBeenCalledWith('test-id-1');
  });
});
