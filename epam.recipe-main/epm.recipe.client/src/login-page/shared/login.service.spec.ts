import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { Login } from './login';
import { environment } from '../../environments/environment';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiBaseUrl + 'api/authservice/login';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService]
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loginUser', () => {
    it('should return an Observable of the response on success', () => {
      const loginObj: Login = { email: 'test', password: 'password' };
      const mockResponse = 'mockToken';

      service.loginUser(loginObj).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should handle errors properly', () => {
      const loginObj: Login = { email: 'test', password: 'password' };
      const errorMsg = 'Server error';

      service.loginUser(loginObj).subscribe(
        () => fail('expected an error, not a response'),
        error => {
          expect(error.status).toBe(500);
          expect(error.error).toBe(errorMsg);
        }
      );

      const req = httpMock.expectOne(apiUrl);
      req.flush(errorMsg, { status: 500, statusText: 'Server Error' });
    });
  });
});
