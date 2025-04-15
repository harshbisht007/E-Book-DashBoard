import { Component, inject, OnInit } from '@angular/core';
import { BookService } from '../../core/services/book.service';
import { RouterLink } from '@angular/router';
import {Book} from '../../core/models/book.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private bookService = inject(BookService);

  books: Book[] = [];
  allCategories: string[] = [];
  searchQuery: string = '';
  activeCategory: string = 'All';

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.extractCategories();
      },
      error: (err) => {
        console.error('Error loading books:', err);
      }
    });
  }

  extractCategories() {
    const categories = new Set<string>();
    this.books.forEach(book => {
      if (book.category) {
        categories.add(book.category);
      }
    });
    this.allCategories = Array.from(categories);
  }

  searchBooks() {
    if (!this.searchQuery.trim()) {
      this.loadBooks();
      return;
    }

    this.bookService.searchBooks(this.searchQuery).subscribe({
      next: (data) => {
        this.books = data;
      },
      error: (err) => {
        console.error('Error searching books:', err);
      }
    });
  }

  filterByCategory(category: string) {
    this.activeCategory = category;

    if (category === 'All') {
      this.loadBooks();
      return;
    }

    this.bookService.getBooksByCategory(category).subscribe({
      next: (data) => {
        this.books = data;
      },
      error: (err) => {
        console.error(`Error loading books for category ${category}:`, err);
      }
    });
  }


}
