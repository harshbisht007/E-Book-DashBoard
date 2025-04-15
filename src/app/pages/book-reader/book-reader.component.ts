import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../core/models/book.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';

@Component({
  selector: 'app-book-reader',
  standalone: true,
  imports: [CommonModule, FormsModule, Toast, DialogModule],
  providers: [MessageService],
  templateUrl: './book-reader.component.html',
  styleUrls: ['./book-reader.component.css'],
})
export class BookReaderComponent {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  book: Book | any;
  pageIndex = 0;
  showBuyModal: boolean = false;
  userHasPurchasedBook = false;
  constructor(private messageService: MessageService,) {
  }
  ngOnInit() {
    const bookId = this.route.snapshot.paramMap.get('id')!;
    this.bookService.getBookById(bookId).subscribe((book) => {
      this.book = book;
      this.loadLastReadPage(bookId);
      this.loadPurchaseStatus(bookId);
    });
  }

  get previewLimit(): number {
    return Math.floor((this.book?.content?.length || 0) * 0.2);
  }

  get isPreview(): boolean {
    return !this.userHasPurchasedBook;
  }

  get isLocked(): boolean {
    return this.isPreview && this.pageIndex >= this.previewLimit;
  }

  nextPage() {
    if (this.book && this.pageIndex < this.book.content.length - 1) {
      if (!this.isLocked) {
        this.pageIndex++;
        this.saveProgress();
      }
    }
  }

  prevPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.saveProgress();
    }
  }

  onSliderChange(event: any) {
    const newIndex = parseInt(event.target.value, 10);
    if (!this.isPreview || newIndex < this.previewLimit) {
      this.pageIndex = newIndex;
      this.saveProgress();
    }
  }

  private saveProgress() {
    if (this.book) {
      const key = `reading-progress-${this.book.id}`;
      localStorage.setItem(key, JSON.stringify({ page: this.pageIndex }));
    }
  }

  private loadLastReadPage(bookId: string) {
    const progress = localStorage.getItem(`reading-progress-${bookId}`);
    if (progress) {
      const { page } = JSON.parse(progress);
      this.pageIndex = page;
    }
  }

  private loadPurchaseStatus(bookId: string) {
    const purchased = localStorage.getItem(`book-purchased-${bookId}`);
    this.userHasPurchasedBook = purchased === 'true';
  }

  buyBook() {
    if (this.book) {
      const key = `book-purchased-${this.book.id}`;
      localStorage.setItem(key, 'true');
      this.userHasPurchasedBook = true;
      this.showBuyModal=false;
      this.messageService.add({
        severity: 'success',
        summary: 'Purchase Successful',
        detail: 'Thank you for your purchase!',
      });
    }
  }
}
