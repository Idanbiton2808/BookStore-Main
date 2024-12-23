import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { BookService } from './book.service';
import { LocalStorageService } from './local-storage.service';
import { ModalService } from './modal.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginFailed = new BehaviorSubject<boolean>(false);
  user: User = this.localStorageService.getUser();
  private _isLoggedin = new BehaviorSubject<boolean>(false);
  isLoggedin:Observable<boolean> = this._isLoggedin.asObservable();
  isProfileEdited = new BehaviorSubject<boolean>(false);
  pwPattern: string = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$';
  adminSecretPassword: string = 'Admin123!';
  adminLoginUrl = this.router.url.includes('admin/login');
  
  userDeleted: boolean = false;

  constructor(private localStorageService: LocalStorageService, private router: Router, private bookService: BookService, private modalService: ModalService) { }


  signup(id: string, username: string, name: string, email: string, password: string, isAdmin: boolean) {
    if (this.localStorageService.isUsernameTaken(username)) {
      console.error('Signup failed: Username already exists');
      alert('UserName is taken!')
      return; 
    }
    if (/*this.adminLoginUrl &&*/ password === this.adminSecretPassword) {
      console.log('adminas achived');
      isAdmin = true;
    }
    this.localStorageService.user = new User(id, username, name, email, password, [], isAdmin);
    this.localStorageService.storeUser(
      this.localStorageService.user.id,
      this.localStorageService.user.username,
      this.localStorageService.user.name,
      this.localStorageService.user.email,
      this.localStorageService.user.password,
      this.localStorageService.user.cart,
      this.localStorageService.user.isAdmin
    );
    this.router.navigate(['/login']);
  }

  
  
  /*signup(id: string, username:string, name: string, email: string, password:string, isAdmin: boolean) {
    if(this.adminLoginUrl && password === this.adminSecretPassword)
      isAdmin = true;
    this.localStorageService.user = new User(id, username, name, email, password, [], isAdmin)
    this.localStorageService.storeUser(this.localStorageService.user.id, this.localStorageService.user.username, this.localStorageService.user.name,this.localStorageService.user.email,this.localStorageService.user.password, this.localStorageService.user.cart, this.localStorageService.user.isAdmin);
    this.router.navigate(['/login']);
  }*/

  onSubmitLogin(username:string, password:string) {
    this.localStorageService.storeGuestCart(this.localStorageService.user.cart);
    this.localStorageService.user.username = 'guest';
    this.localStorageService.storeUser('guest', this.localStorageService.user.username, this.localStorageService.user.name,
      this.localStorageService.user.email, this.localStorageService.user.password, this.localStorageService.user.cart, this.localStorageService.user.isAdmin);
    let guest = this.localStorageService.getUser();
    console.log(guest);

  const user = this.localStorageService.getUserByUsername(username);

  if (!user) {
    this.loginFailed.next(true);
    console.log('User not found');
    return;
  }

  if (user.password !== password) {
    this.loginFailed.next(true);
    console.log('Incorrect password');
    return;
  }

  if(user.isAdmin){
  if((user.username !== 'admin' || user.password !== this.adminSecretPassword) || !this.router.url.includes('admin/login')){
    console.log('Incorrect possssss');
    this.loginFailed.next(true);
    console.log('Incorrect pord');
    console.log(user);
    return;
  }
  }
    this.localStorageService.user.username = username;
    this.user = this.localStorageService.getUser();
    console.log(this.user);
    if (this.user.username === 'admin' && this.user.password === this.adminSecretPassword) {
      if (this.router.url.includes('admin/login')) {
        this.localStorageService.user.isAdmin = true;
        console.log('admin logged in');
        this.localStorageService.user.password = password;
        this.login(this.user);
        return ;
          }
        console.error('Admins must log in through the admin portal.');
        //this._isLoggedin.next(false);
        this.loginFailed.next(true);
        return;
        }
    console.log(this.user);
    console.log(guest);
    if(!this.user /*|| !this.user.cart*/) { //added the second this.user.cart
      this.localStorageService.user = {id: '', username: '', name: '', email: '', password: '', cart: [], isAdmin: false};
      this.loginFailed.next(true);
      this._isLoggedin.next(false);
      console.log('failed');
      return;
    }
    

    if(this.user.username === username && this.user.password === password) {
        this.localStorageService.user.password = password;
        if(this.user?.cart?.length === 0){
          this.localStorageService.user.cart = guest.cart
          console.log('im here');
        }
         else
           this.localStorageService.user.cart  = this.user.cart;
        console.log('you are in!');
        this.login(this.user);
    }
    else {
      this._isLoggedin.next(false);
      this.loginFailed.next(true);
      console.log(this.user);
      console.log(this.loginFailed);
    }
  }

  //if(/*this.adminLoginUrl &&*/ username === 'admin' && password === this.adminSecretPassword){
    //this.localStorageService.user.isAdmin = true;
 //}

  login(user:any) {
    this.localStorageService.user.id = this.user.id;
    this.localStorageService.user.name = this.user.name;
    this.localStorageService.user.email = this.user.email;
    this.localStorageService.user.isAdmin = this.user.isAdmin;
    this.localStorageService.storeUser(this.localStorageService.user.id, this.localStorageService.user.username, this.localStorageService.user.name,
      this.localStorageService.user.email, this.localStorageService.user.password, this.localStorageService.user.cart, this.localStorageService.user.isAdmin);
    this._isLoggedin.next(true)
    this.loginFailed.next(false);
    if(user.isAdmin){
      this.router.navigate(['/admin']);
      console.log('admin bbbb');
    }
    else
      this.router.navigate(['/home']);
      console.log('user enter')
  }

      

  onEditProfile(form: FormGroup) {
    const id = this.localStorageService.user.id;
    const cart = this.localStorageService.user.cart;
    localStorage.removeItem(this.localStorageService.user.username);
    this.localStorageService.user.username = form.get('username')?.value;
    this.localStorageService.user.password = form.get('password')?.value;
    this.localStorageService.user.email = form.get('email')?.value;
    this.localStorageService.user.name = form.get('name')?.value;
    this.localStorageService.user.isAdmin = this.localStorageService.user.password === this.adminSecretPassword;
    this.isProfileEdited.next(true);
    this.localStorageService.storeUser(id, this.localStorageService.user.username, this.localStorageService.user.name,
      this.localStorageService.user.email, this.localStorageService.user.password, cart, this.localStorageService.user.isAdmin);
    this.localStorageService.user = this.localStorageService.getUser();
    this.modalService.exitModal(form);
  }

  deleteUser() {
    this.userDeleted = true;
    localStorage.removeItem(this.localStorageService.user.username);
    this.logout();
  }

  logout() {
    if(!this.userDeleted) {
      console.log('logiing out');
      this.localStorageService.storeCart(this.localStorageService.user.cart);
      this.localStorageService.storeBookList(this.bookService.bookList);
      this.localStorageService.storeUser(this.localStorageService.user.id, this.localStorageService.user.username, this.localStorageService.user.name,this.localStorageService.user.email,this.localStorageService.user.password, this.localStorageService.user.cart, this.localStorageService.user.isAdmin);
    }
    this.localStorageService.user = {
      id: '',
      username: '',
      name: '',
      email: '',
      password: '',
      cart: this.localStorageService.getGuestCart(),
      isAdmin: false,
    };
    this._isLoggedin.next(false);
    this.localStorageService.user.username = '';
    this.localStorageService.user.cart = this.localStorageService.getGuestCart();
    this.localStorageService.storeUser(this.localStorageService.user.id, this.localStorageService.user.username, this.localStorageService.user.name,this.localStorageService.user.email,this.localStorageService.user.password, this.localStorageService.user.cart, this.localStorageService.user.isAdmin);
    this.router.navigate(['/login']);
  }
}
