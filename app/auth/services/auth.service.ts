import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Router } from "@angular/router";
import { from, Observable, tap } from "rxjs";
import { Todo } from "src/app/models/Todo";
import { User } from "src/app/models/User";
import { GoogleAuthProvider } from "firebase/auth";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  // Criar uma propriedade com a referência da coleção de usuários do firebase (tabela de usuários no firebase)
  // Documentos são os valores de dentro das coleções
  private usersCollection = this.store.collection<User>("users"); // caso não exista, o firebase cria automaticamente
  // este <User> é só tipagem, se não passar não vai dar erro, mas ficará retornando do tipo desconhecido(unknow) e numa linguagem tipada, é bom para organização.

  constructor(
    private authentication: AngularFireAuth, // serve para manipular a parte de autenticação do firebase (cadastro)
    private store: AngularFirestore,
    private router: Router
  ) {} // serve para manipular o banco de dados do firebase (buscar ou salvar informações no banco de dados)

  get currentUser() {
    // get transforma a função em uma propriedade que podemos acessar para poder apenas leitura dos dados
    /* authState retorna um Observable com o usuário que está logado atualmente na aplicação, se ele existir
      se não houver nenhum usuário logado, ele retornará nulo */
    return this.authentication.authState;
  }

  private saveUserData() {
    // a variável credencials tem o mesmo retorno que a função createUserWithEmailAndPassword (linha 57)
    return tap((credencials: firebase.default.auth.UserCredential) => {
      // Recuperar o uid do usuário
      const uid = credencials.user?.uid as string;

      // Recuperar o email do usuário
      const email = credencials.user?.email as string; // as string é um cach para que não fique acusando erro e transforme logo para string
      const todos: Todo[] = [];

      // essa função doc cria a referência para um documento em uma coleção
      // a função doc te retorna a referência para um documento na coleção a partir do seu UID
      this.usersCollection.doc(uid).set({
        // A função set atribui valores ao documento que está se referenciando
        uid: uid,
        email: email,
        todos: todos,
      });

      credencials.user?.sendEmailVerification(); // Envia um email de verificação
    });
  }

  signUpWithEmailAndPassword(email: string, password: string) {
    // a função createUserWithEmailAndPassword retorna uma promise, a função from transforma a promise num observable.
    /* O from transformará a Promise que o método createUserWithEmailAndPassword em um observable  */
    /* O método createUserWithEmailAndPassword cadastra um novo usuário no firebase pelo email e senha */
    return from(
      this.authentication.createUserWithEmailAndPassword(email, password)
    ).pipe(this.saveUserData());
  }

  signInWithEmailAndPassword(email: string,password: string): Observable<firebase.default.auth.UserCredential> {
    return from(
      this.authentication.signInWithEmailAndPassword(email, password)
    );
  }

  signInWithGoogle() {
    const googlePorvider = new GoogleAuthProvider();
    return from(this.authentication.signInWithPopup(googlePorvider)).pipe(
      this.saveUserData()
    );
  }

  signOut() {
    return from(this.authentication.signOut()).pipe(
      tap(() => {
        this.router.navigateByUrl("auth/login");
      })
    );
  }
}
