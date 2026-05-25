import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal Component', () => {
  let mockOnClose;

  beforeEach(() => {
    mockOnClose = vi.fn();
    vi.clearAllMocks();
  });

  // ✅ RENDERIZADO CONDICIONAL TESTS
  describe('Conditional Rendering', () => {
    it('does not render when isOpen is false', () => {
      const { container } = render(
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
      expect(container.firstChild).toBeNull();
    });

    it('renders when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Test Content</p>
        </Modal>
      );

      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('changes visibility when isOpen prop changes', () => {
      const { rerender } = render(
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();

      rerender(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });

    it('removes modal when isOpen changes from true to false', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByText('Test Modal')).toBeInTheDocument();

      rerender(
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });
  });

  // ✅ CONTENIDO TESTS
  describe('Content Display', () => {
    it('renders title when provided', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Modal Title">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByText('Modal Title')).toBeInTheDocument();
    });

    it('does not render title section when not provided', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <p>Content</p>
        </Modal>
      );

      // Buscar el h3 que contiene el título
      const titleElement = document.querySelector('h3');
      expect(titleElement).not.toBeInTheDocument();
    });

    it('renders children content correctly', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>
            <p>Line 1</p>
            <p>Line 2</p>
            <button>Action Button</button>
          </div>
        </Modal>
      );

      expect(screen.getByText('Line 1')).toBeInTheDocument();
      expect(screen.getByText('Line 2')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
    });

    it('renders complex JSX as children', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Complex Modal">
          <div className="test-container">
            <form>
              <input type="text" placeholder="Name" />
              <input type="email" placeholder="Email" />
            </form>
          </div>
        </Modal>
      );

      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    });
  });

  // ✅ CIERRE TESTS
  describe('Closing Behavior', () => {
    it('calls onClose when close button (X) is clicked', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      const closeButton = screen.getByLabelText('Cerrar');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('closes modal with keyboard Escape key', async () => {
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop (outside area) is clicked', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      // Buscar el backdrop (el div exterior con onClick={onClose})
      const backdrops = screen.getAllByText(/Test Modal|Content/);
      const modal = screen.getByText('Test Modal').closest('section');
      const backdrop = modal.parentElement; // El div que contiene el backdrop

      fireEvent.click(backdrop);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does NOT call onClose when modal content is clicked', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p data-testid="modal-content">Content</p>
        </Modal>
      );

      const content = screen.getByTestId('modal-content');
      fireEvent.click(content);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('does NOT call onClose when clicking inside modal body', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div>
            <button>Click me</button>
          </div>
        </Modal>
      );

      const button = screen.getByRole('button', { name: 'Click me' });
      fireEvent.click(button);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('stops propagation when clicking on modal itself', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <div className="test-area">Content Area</div>
        </Modal>
      );

      // El modal tiene e.stopPropagation() en el onClick de la section
      const modal = screen.getByText('Test Modal').closest('section');
      fireEvent.click(modal);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  // ✅ PORTAL TESTS
  describe('Portal Rendering', () => {
    it('renders modal in document.body using portal', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      // El componente debería renderizar en el body, no en el container
      expect(document.body.querySelector('section')).toBeInTheDocument();
    });

    it('mounts and unmounts modal correctly', () => {
      const { unmount } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      expect(document.body.querySelector('section')).toBeInTheDocument();

      unmount();

      // Después de desmontar, el modal debería estar fuera del DOM
      // (puede quedar algún residuo del portal, pero el contenido no)
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });
  });

  // ✅ ESTRUCTURA TESTS
  describe('Structure & Classes', () => {
    it('has backdrop with correct styling classes', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      const backdrop = document.querySelector('.fixed.inset-0');
      expect(backdrop).toBeInTheDocument();
      expect(backdrop).toHaveClass('inset-0');
      expect(backdrop).toHaveClass('bg-slate-950/70');
      expect(backdrop).toHaveClass('backdrop-blur-sm');
    });

    it('has modal section with correct styling', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      const modal = document.querySelector('section.rounded-2xl');
      expect(modal).toBeInTheDocument();
      expect(modal).toHaveClass('rounded-2xl');
      expect(modal).toHaveClass('border');
      expect(modal).toHaveClass('bg-white');
      expect(modal).toHaveClass('shadow-2xl');
    });

    it('has close button with correct icon and accessibility', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      const closeButton = screen.getByLabelText('Cerrar');
      expect(closeButton).toHaveTextContent('×');
      expect(closeButton).toBeInTheDocument();
    });

    it('renders title in header section', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="My Modal Title">
          <p>Content</p>
        </Modal>
      );

      const header = document.querySelector('div.border-b');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('My Modal Title');
    });

    it('renders content in scrollable body', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test">
          <p>Scrollable content</p>
        </Modal>
      );

      const body = document.querySelector('.overflow-y-auto');
      expect(body).toBeInTheDocument();
      expect(body).toHaveTextContent('Scrollable content');
    });
  });

  // ✅ MULTIPLE INTERACTIONS TESTS
  describe('Multiple Interactions', () => {
    it('handles opening and closing multiple times', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      // Cerrar
      rerender(
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();

      // Abrir de nuevo
      rerender(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );
      expect(screen.getByText('Test Modal')).toBeInTheDocument();

      // Cerrar de nuevo
      rerender(
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );
      expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    it('closes on X button and then can be reopened', async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      const closeButton = screen.getByLabelText('Cerrar');
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);

      // Simular que el padre cerró el modal
      rerender(
        <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      // Simular que el padre abre el modal de nuevo
      rerender(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>New Content</p>
        </Modal>
      );

      expect(screen.getByText('New Content')).toBeInTheDocument();
    });
  });

  // ✅ EDGE CASES
  describe('Edge Cases', () => {
    it('handles empty children', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Empty Modal">
        </Modal>
      );

      expect(screen.getByText('Empty Modal')).toBeInTheDocument();
    });

    it('handles very long content', () => {
      const longContent = Array.from({ length: 100 }, (_, i) => (
        <p key={i}>Line {i + 1}</p>
      ));

      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Long Modal">
          {longContent}
        </Modal>
      );

      expect(screen.getByText('Line 1')).toBeInTheDocument();
      expect(screen.getByText('Line 100')).toBeInTheDocument();
    });

    it('handles special characters in title', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test & Special <Characters>">
          <p>Content</p>
        </Modal>
      );

      expect(screen.getByText('Test & Special <Characters>')).toBeInTheDocument();
    });

    it('handles rapid opens and closes', () => {
      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      for (let i = 0; i < 5; i++) {
        rerender(
          <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
            <p>Content</p>
          </Modal>
        );
        rerender(
          <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
            <p>Content</p>
          </Modal>
        );
      }

      expect(screen.getByText('Test Modal')).toBeInTheDocument();
    });
  });

  // ✅ ACCESSIBILITY TESTS
  describe('Accessibility', () => {
    it('has accessible close button', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      const closeButton = screen.getByLabelText('Cerrar');
      expect(closeButton).toHaveAttribute('aria-label');
    });

    it('close button is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
          <p>Content</p>
        </Modal>
      );

      const closeButton = screen.getByLabelText('Cerrar');
      closeButton.focus();

      expect(closeButton).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
