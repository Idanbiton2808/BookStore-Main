import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})


///idan changed the fallback to an empty arr [] insted of '[]'
export class LocalStorageService {
  user: User =  {id: '', username: '', name: '', email: '', password: '', cart: [], isAdmin: false};

  constructor() { }

  storeCart(myCart: Book[]) {
    localStorage.setItem('cart', JSON.stringify(myCart));
  }

  getCart() {
    this.user.cart = (JSON.parse(''+localStorage.getItem('cart'))) || [];
    return this.user.cart;
  }

  storeGuestCart(myCart: Book[]) {
    localStorage.setItem('guestCart', JSON.stringify({myCart}.myCart));
  }

  getGuestCart(){
    this.user.cart = (JSON.parse(''+localStorage.getItem('guestCart'))) || [];
    return this.user.cart;
  }

  storeUser(id: string, username: string, name: string, email: string, password: string, cart: Book[], isAdmin: boolean) {
    localStorage.setItem(this.user.username, JSON.stringify({id: id, username: username, name: name, email: email, password: password, cart: cart, isAdmin: isAdmin}));
  }

  /*getUser(){
    this.user =JSON.parse(''+localStorage.getItem(this.user.username));
    return this.user;
  }*/

  getUser(): User {
      const userData = localStorage.getItem(this.user.username); 
      try {
        return userData ? JSON.parse(userData) : this.getDefaultUser();
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        return this.getDefaultUser();
      }
    }
    getUserByUsername(username: string): User | null {
      const userData = localStorage.getItem(username);
      return userData ? JSON.parse(userData) : null;
    }
    
    
    getDefaultUser(): User {
      return { id: '', username: '', name: '', email: '', password: '', cart: [], isAdmin: false };
    }

    isUsernameTaken(username: string): boolean {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key === username) {
          return true; 
        }
      }
      return false; 
    }


  storeBookList(bookList: Book[]) {
    localStorage.setItem('bookList', JSON.stringify({bookList}.bookList));
  }

  getBookList(): Book[] {
    return (JSON.parse(''+localStorage.getItem('bookList'))) || [];
    //const bookList = localStorage.getItem('bookList');
    //return bookList ? JSON.parse(bookList) : [];
  }

    /*getBookList(): Book[] {
      const bookList = localStorage.getItem('bookList');
      try {
        return bookList ? JSON.parse(bookList) : [];
      } catch (error) {
        console.error('Error parsing bookList from localStorage:', error);
        return [];
      }
    }*/
    
}
