import { Component, OnDestroy, OnInit } from '@angular/core';
import intlTelInput from 'intl-tel-input';
import { provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { BrnAccordionContentComponent } from '@spartan-ng/ui-accordion-brain';
import { HlmCheckboxCheckIconComponent, HlmCheckboxComponent } from '@spartan-ng/ui-checkbox-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import {
  HlmAccordionContentDirective,
  HlmAccordionDirective,
  HlmAccordionIconDirective,
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CodeInputModule } from 'angular-code-input';

@Component({
  selector: 'app-registration-part',
  standalone: true,
  imports: [
    BrnAccordionContentComponent,
    HlmAccordionDirective,
    HlmAccordionItemDirective,
    HlmAccordionTriggerDirective,
    HlmAccordionContentDirective,
    HlmAccordionIconDirective,
    HlmIconComponent,
    HlmInputDirective,
    HlmButtonDirective,
    FormsModule,
    HlmLabelDirective,
    HlmCheckboxComponent,
    HlmCheckboxCheckIconComponent,
    CommonModule,
    CodeInputModule
  ],
  providers: [provideIcons({ lucideEye, lucideEyeOff })],
  templateUrl: './registration-part.component.html',
  styleUrls: ['./registration-part.component.css']
})
export class RegistrationPartComponent implements OnInit, OnDestroy {
  isFormSubmitted: boolean = false;

  passwordMismatch: boolean = false;
  passwordInvalid: boolean = false;
  passwordTooShort: boolean = false;
  invalidPasswordChars: boolean = false;

  phoneInvalid: boolean = false;

  password1Visible: boolean = false;
  password2Visible: boolean = false;

  password1Value: string = "";
  password2Value: string = "";

  passwordPattern = /^[A-Za-z0-9]+$/;

  phoneValue: string = "";

  rememberMe: boolean = false;

  isModalVisible: boolean = false;

  remainingTime: number = 60;
  formattedTime: string = '01:00';
  interval: any;

  verificationCode: string = '';
  enteredCode: string = '';

  imgPath: string = 'success.png';

  onCodeChanged(code: string) {
    this.enteredCode = code;
  }

  onCodeCompleted(code: string) {
    if (this.verificationCode === code) {
      alert("Код подтвержден!");
    } else {
      alert("Неверный код!");
    }
  }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.formatTime();
      } else {
        clearInterval(this.interval);
      }
    }, 1000);

    const inputEl = document.getElementById('phoneNumberPrefix') as HTMLInputElement;
    if (inputEl) {
      intlTelInput(inputEl, {
        initialCountry: 'by',
        separateDialCode: true,
        utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js'
      });
    }

    const savedPassword = localStorage.getItem('savedPassword');
    const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

    if (savedRememberMe && savedPassword) {
      this.password1Value = savedPassword;
      this.password2Value = savedPassword;
      this.rememberMe = savedRememberMe;
    }
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  formatTime() {
    const minutes = Math.floor(this.remainingTime / 60);
    const seconds = this.remainingTime % 60;
    this.formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  handleInputChange(event: Event) {
    this.isFormSubmitted = false;
    const target = event.target as HTMLInputElement;
    const value = target.value;

    switch (target.name) {
      case 'phone':
        this.phoneValue = value;
        this.validatePhone();
        break;
      case 'password1':
        this.password1Value = value;
        this.validatePassword();
        this.validatePasswordMatch();
        this.toggleButtonVisibility('password1', value);
        break;
      case 'password2':
        this.password2Value = value;
        this.validatePassword();
        this.validatePasswordMatch();
        this.toggleButtonVisibility('password2', value);
        break;
    }
  }

  toggleButtonVisibility(inputName: string, value: string) {
    const inputContainer = document.querySelector(`.input-container.${inputName}`) as HTMLElement;
    if (inputContainer) {
      if (value.length > 0) {
        inputContainer.classList.add('show-button');
      } else {
        inputContainer.classList.remove('show-button');
      }
    }
  }

  togglePasswordVisibility1() {
    this.password1Visible = !this.password1Visible;
  }

  togglePasswordVisibility2() {
    this.password2Visible = !this.password2Visible;
  }

  validatePasswordMatch() {
    this.passwordMismatch = this.password1Value !== this.password2Value;
  }

  validatePassword() {
    this.passwordMismatch = this.password1Value !== this.password2Value;

    if (this.passwordMismatch) {
      this.passwordTooShort = false;
      this.invalidPasswordChars = false;
    } else {
      this.passwordTooShort = this.password1Value.length <= 6 || this.password2Value.length <= 6;

      if (!this.passwordTooShort) {
        this.invalidPasswordChars = !this.passwordPattern.test(this.password1Value) || !this.passwordPattern.test(this.password2Value);
      }
    }
  }

  validatePhone() {
    this.phoneInvalid = this.phoneValue.length !== 9;
  }

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  resendCode() {
    // Генерируем новый код верификации
    this.verificationCode = this.generateVerificationCode();
    console.log("Generated new verification code: ", this.verificationCode); // Для отладки
  
    // Сбрасываем таймер
    this.remainingTime = 60;
    this.formatTime();
  
    // Перезапускаем таймер
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        this.formatTime();
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }
  

  submitRegistration() {
    this.isFormSubmitted = true;
    this.validatePassword();
    this.validatePasswordMatch();
    this.validatePhone();

    if (this.phoneInvalid || this.passwordMismatch || this.passwordInvalid || this.passwordTooShort || this.invalidPasswordChars) {
      return;
    } else {
      if (this.rememberMe) {
        localStorage.setItem('savedPassword', this.password1Value);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('savedPassword');
        localStorage.removeItem('rememberMe');
      }

      this.verificationCode = this.generateVerificationCode();
      console.log("Generated verification code: ", this.verificationCode); // Для отладки
      this.isModalVisible = true;
    }
  }

  closeModal() {
    this.isModalVisible = false;
  }
}
