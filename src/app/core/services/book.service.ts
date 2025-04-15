import { Injectable } from '@angular/core';
import {map, Observable, of} from 'rxjs';
import {Book} from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private books: Book[] = [
    {
      id: '1',
      title: 'The Enchanted Forest',
      author: 'Luna Starfall',
      category: 'Fantasy',
      coverImage: 'assets/images/the_enchanted_forest.jpg',
      content: [
        'Page 1: In a realm where magic thrives, a young girl named Elara discovers a hidden path leading to the Enchanted Forest.',
        'Page 2: As she ventures deeper, she encounters mystical creatures and learns about the ancient magic that protects the forest.',
        'Page 3: Elara must unite the forest inhabitants to save their home from a dark sorcerer threatening to drain its magic.',
        'Page 4: With the help of a brave knight and a wise old wizard, Elara embarks on a quest to reclaim the forest’s lost magic.',
        'Page 5: The final battle unfolds, revealing Elara’s true destiny as the guardian of the Enchanted Forest.',
      ],
    },
    {
      id: '2',
      title: 'The Time Traveler’s Diary',
      author: 'Oliver Timekeeper',
      category: 'Science Fiction',
      coverImage: 'assets/images/The Time Travel Diaries.jpg',
      content: [
        'Page 1: Oliver discovers an ancient diary that allows him to travel through time and witness historical events.',
        'Page 2: His first journey takes him to the Renaissance, where he meets famous artists and inventors.',
        'Page 3: As he travels further, Oliver realizes that his actions in the past can alter the present.',
        'Page 4: He must navigate the complexities of time travel while trying to prevent a catastrophic event in his own timeline.',
        'Page 5: In a thrilling conclusion, Oliver learns the importance of history and the impact of every small action.',
      ],
    },
    {
      id: '3',
      title: 'The Secret of the Crystal Cavern',
      author: 'Mira Moonshadow',
      category: 'Adventure',
      coverImage: 'assets/images/The Secret of the Crystal Cavern.jpg',
      content: [
        'Page 1: A group of friends stumbles upon a hidden cavern filled with glowing crystals that hold ancient secrets.',
        'Page 2: Each crystal reveals a different story from the past, leading them on a treasure hunt through time.',
        'Page 3: As they uncover the secrets, they face challenges and puzzles that test their friendship and courage.',
        'Page 4: The friends must work together to unlock the final mystery before the cavern is lost forever.',
        'Page 5: In the end, they discover that the true treasure lies in their bond and the adventures they shared.',
      ],
    },
    {
      id: '4',
      title: 'Whispers of the Ocean',
      author: 'Sophie Wavecrest',
      category: 'Fantasy',
      coverImage: 'assets/images/Whispers of the Ocean.jpg',
      content: [
        'Page 1: In a coastal village, a young girl named Marina discovers she can communicate with sea creatures.',
        'Page 2: As she learns about their world, she uncovers a plot by a greedy merchant to exploit the ocean’s resources.',
        'Page 3: Marina teams up with a rebellious dolphin and a wise old turtle to protect their home.',
        'Page 4: Together, they embark on an underwater adventure filled with danger and magic.',
        'Page 5: The climax reveals Marina’s true heritage as a guardian of the sea, destined to protect its wonders.',
      ],
    },
    {
      id: '5',
      title: 'The Last Dragon’s Heart',
      author: 'Ethan Firewing',
      category: 'Fantasy',
      coverImage: 'assets/images/The Last Dragon’s Heart.jpg',
      content: [
        'Page 1: In a world where dragons are thought to be extinct, a young boy named Finn discovers a dragon egg.',
        'Page 2: When the dragon hatches, Finn learns that he is the last hope for the dragon race.',
        'Page 3: Together, they embark on a quest to find the legendary Dragon’s Heart, said to restore balance to their world.',
        'Page 4: Along the way, they face treacherous foes and uncover the truth about the dragon’s past.',
        'Page 5: In a heartwarming finale, Finn learns the value of friendship and bravery as they fight to save their world.',
      ],
    },
  ];

  getBooks(): Observable<Book[]> {
    return of(this.books);
  }

  getBookById(id: string): Observable<Book | undefined> {
    return of(this.books.find(b => b.id === id));
  }

  searchBooks(query: string): Observable<Book[]> {

    return this.getBooks().pipe(
      map(books => books.filter(book =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
      ))
    );

  }
  getBooksByCategory(category: string): Observable<Book[]> {


    return this.getBooks().pipe(
      map(books => books.filter(book => book.category === category))
    );

  }

}
